from patientdb.models import Signals, Patient
from django.shortcuts import get_object_or_404
from patientdb.serializers import SignalsSerializer, PatientSerializer, UploadSerializer
from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
import django_filters
from rest_framework import generics
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.views import APIView
from django.http import HttpResponse, JsonResponse
from rest_framework.response import Response
from rest_framework import status
import tensorflow as tf
from tensorflow import keras
import tensorflow_addons as tfa
import numpy as np
import os
from patRecFormatter import dataParser
from django.core.files.storage import default_storage
import pathlib
import shutil


class UploadedFileViewSet(APIView):

    serializer_class = UploadSerializer

    def post(self, request):

        # serialize file data
        serializer = UploadSerializer(data=request.data)

        # validate file
        serializer.is_valid(raise_exception=True)

        # get file object
        file = request.FILES
        tempDir = str(pathlib.Path().absolute()) + \
            '/temp_uploaded_patient_data/'
        os.mkdir(tempDir)
        fileName = ""
        for f in request.FILES.getlist('file'):
            fileName = f
            fileDestination = tempDir + '/' + f._name

            destination = open(fileDestination, 'wb+')
            for chunk in f.chunks():
                destination.write(chunk)
            destination.close()

        # start patRecFormatter to parse data using wfdb library (wave form database)
        dataParser.start(self, tempDir, fileName)

        # delete temp directory and all of its contents
        try:
            shutil.rmtree(tempDir)
        except OSError as e:
            print("Error: %s - %s." % (e.filename, e.strerror))

        return Response(serializer.data)


class SignalsViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = Signals.objects.all().order_by("id")
    serializer_class = SignalsSerializer
    filter_backends = [DjangoFilterBackend]

    filterset_fields = ('signal_record_name', 'time', 'mlii', 'v5')

    def get_queryset(self):
        queryset = Signals.objects.all().order_by("id")
        start = self.request.query_params.get('start')
        end = self.request.query_params.get('end')
        time = self.request.query_params.get('timeRange')
        patient_id = self.request.query_params.get('signal_record_name')

        # Get time slice of data
        if (start and end):
            # Specifying start and end is important as there is math being done in the backend to process
            # the results
            queryset = queryset.filter(
                signal_record_name=patient_id, time__gte=start, time__lt=end)
        elif (time):
            # Silently enforce and interpolate timeRange into the same format as start and end
            time = time.split(',')
            if len(time) == 2:
                queryset = queryset.filter(
                    signal_record_name=patient_id, time__gte=time[0], time__lt=time[1])
        elif (start and not end or end and not start):
            # Error, bad request
            return None

        return queryset


class PatientViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer

    def get_queryset(self):
        queryset = Patient.objects.all().order_by("record_name")
        patient = self.request.query_params.get('patient')

        if (patient):
            queryset = queryset.filter(record_name=patient)

        return queryset


class Predict_Signals(APIView):
    """
    Predict_Signals is an API endpoint that allows users to run and get results
    from a machine-learning model on the current dataset.

    :param APIView: Django's View in the REST framework
    :type APIView: Subclass of View
    """

    def get(self, request):
        """
        get implements the GET request for the ML view, returns a list of 
        predicted annotations.
        """
        # TODO: Current get request accpets one model, as given by the sponsor.
        #      Later, when the next model is given, integrate it here

        # Extract required params
        start = int(request.GET['start'])
        end = int(request.GET['end'])
        patient_id = int(request.GET['signal_record_name'])
        lead_type = request.GET['lead']

        if end == 0:
            return Response({"results": {}}, status=200)

        # Specifying parameters and classification for the model
        WINDOW_SIZE = 360
        TIME_STEP = 1
        EPOCHS = 1
        CHANNEL = lead_type.upper()
        CLASSIFICATION = {' ': 0, 'N': 1, '"': 2, 'A': 3, 'E': 4, 'F': 5, 'J': 6, 'L': 7, '!': 8, 'Q': 9,
                          'R': 10, 'S': 11, 'V': 12, 'Z': 13, '[': 14, ']': 15, 'a': 16, 'e': 17, 'f': 18, 'j': 19}

        # Current location of the model given
        # TODO: might need to refactor to hardcode whole name
        local_dir = os.path.abspath('') + "/patientdb/LSTM_Classification" + \
            "/LSTM_RW_Classification_" + \
            str(WINDOW_SIZE) + "_e" + str(EPOCHS) + ".h5"

        # This is where the model seems to be loaded, might be able to initialized when the app is initialized
        model = tf.keras.models.load_model(local_dir)

        # Get data from database
        data = Signals.objects.filter(
            signal_record_name=patient_id, time__gte=start, time__lt=end).order_by("time").values(lead_type)
        data = [[time[lead_type]] for time in data]

        # Transform data to fit sample model format before prediction, using the start and end
        # parameters given in the get request
        sample = np.array([data[360*i:360*i+360]
                           for i in range(len(data) // 360)])
        results = model.predict(sample)

        # Classify results of prediction
        np.argmax(results)
        annotation = [list(CLASSIFICATION.keys())[np.argmax(result)]
                      for result in results]
        # If no annotation is found, return error
        if len(annotation) == 0:
            return HttpResponse(status=500)

        # Map annotations to their time slot, each annotation is mapped in the
        # middle between the two time slices given into the ML model
        tempDict = {}
        mapped_annotation = {}
        prev = start
        j = 0
        for i in range(start + 1, end + 1):
            # Compute current index
            index = (i + prev) / 2
            mapped_annotation[index] = annotation[j]
            # Get next index
            prev = i
            j += 1
        # Return response if classification found
        tempDict["results"] = mapped_annotation
        return Response(tempDict, status=200)

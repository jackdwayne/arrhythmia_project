from patientdb.models import Signals, Patient
from django.shortcuts import get_object_or_404
from patientdb.serializers import SignalsSerializer, PatientSerializer
from rest_framework import viewsets
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

        if (start and end):
            queryset = queryset.filter(time__gte=start, time__lt=end)
        if (time):
            queryset = queryset.filter(time__range=time.split(','))

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

# Resources to refer to
# https://towardsdatascience.com/creating-a-machine-learning-based-web-application-using-django-5444e0053a09
# https://medium.com/saarthi-ai/deploying-a-machine-learning-model-using-django-part-1-6c7de05c8d7
# https://www.datagraphi.com/blog/post/2019/12/19/rest-api-guide-productionizing-a-machine-learning-model-by-creating-a-rest-api-with-python-django-and-django-rest-framework
class Predict_Signals(APIView):
    def get(self, request):
        # Required params start and end, extract time slice
        start = int(request.GET['start'])
        end = int(request.GET['end'])

        # start and end are params that specify time. Get number of samples
        # based on the time given (360 samples per second)
        # start *= 360
        # end *= 360

        # Specifying parameters and classification for the model
        WINDOW_SIZE = 360
        TIME_STEP = 1
        EPOCHS = 1
        CHANNEL = 'MLII'
        CLASSIFICATION = {' ': 0, 'N': 1, '"': 2, 'A': 3, 'E': 4, 'F': 5, 'J': 6, 'L': 7, '!': 8, 'Q': 9,
                          'R': 10, 'S': 11, 'V': 12, 'Z': 13, '[': 14, ']': 15, 'a': 16, 'e': 17, 'f': 18, 'j': 19}
        
        # Current location of the model given, might need to refactor to hardcode whole name
        local_dir = os.path.abspath('') + "/patientdb/LSTM_Classification" + \
            "/LSTM_RW_Classification_" + \
            str(WINDOW_SIZE) + "_e" + str(EPOCHS) + ".h5"

        # This is where the model seems to be loaded, might be able to initialized when the app is initialized
        model = tf.keras.models.load_model(local_dir)

        # Get data from database
        # TODO: Need to dynamically pick up record name and type of values (mlii vs v5)
        #       Currently hardcoded: using signal patient record 100 and using mlii
        data = Signals.objects.filter(signal_record_name=100, time__gte=start, time__lt=end).order_by("time").values("mlii")
        data = [[time["mlii"]] for time in data]

        # Transform data to fit sample model format before prediction, using the start and end
        # parameters given in the get request
        sample = np.array([data[360*i:360*i+360] for i in range(len(data) // 360)])
        results = model.predict(sample)

        # Classify results of prediction
        np.argmax(results)
        annotation = [list(CLASSIFICATION.keys())[np.argmax(result)] for result in results]
        # Return response if classification found
        if annotation == ' ':
            return HttpResponse(status=500)
        return Response(annotation, status=200)

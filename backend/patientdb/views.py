from patientdb.models import Signals, Patient
from django.shortcuts import get_object_or_404
from patientdb.serializers import SignalsSerializer, PatientSerializer
from rest_framework import viewsets
from rest_framework.response import Response
import django_filters
from rest_framework import generics
from django_filters.rest_framework import DjangoFilterBackend

# Testing views and tensorflow
from rest_framework.views import APIView
from django.http import HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

import tensorflow as tf
from tensorflow import keras
import tensorflow_addons as tfa
import numpy as np
import pickle
import os
from os import path


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
            queryset = queryset.filter(time__gte=start, time__lte=end)
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

# Current instructions seem to run the model per request
# https://towardsdatascience.com/creating-a-machine-learning-based-web-application-using-django-5444e0053a09
# https://medium.com/saarthi-ai/deploying-a-machine-learning-model-using-django-part-1-6c7de05c8d7
# https://www.datagraphi.com/blog/post/2019/12/19/rest-api-guide-productionizing-a-machine-learning-model-by-creating-a-rest-api-with-python-django-and-django-rest-framework
class test_model(APIView):
    def get(self, request):
        if request.method == 'GET':
            
            # From given example code
            # TODO: need to refactor or redo for our database

            # The following seems to be specifying parameters
            WINDOW_SIZE = 360
            TIME_STEP = 1
            EPOCHS = 1
            CHANNEL = 'MLII'
            CLASSIFICATION = {' ': 0, 'N': 1, '"': 2, 'A': 3, 'E': 4, 'F': 5, 'J': 6, 'L': 7, '!': 8, 'Q': 9,
                              'R': 10, 'S': 11, 'V': 12, 'Z': 13, '[': 14, ']': 15, 'a': 16, 'e': 17, 'f': 18, 'j': 19}
            local_dir = os.path.abspath('') + "/patientdb/LSTM_Classification"

            # This is where the model seems to be loaded, might be able to initialized when the app is initialized
            model = tf.keras.models.load_model(local_dir+ "/LSTM_RW_Classification_"+str(WINDOW_SIZE)+"_e"+str(EPOCHS)+".h5")

            r = 100

            # Unnecessary, since it can be hardcoded later , since it
            # requires location of file, which requires someone working on this 
            # to know the project structure anyways
            #
            # TODO: Hardcode path
            def load_data(local_dir, filename):
                print(local_dir + "/" + filename)
                with open(local_dir + "/" + filename, 'rb') as file:
                    data = pickle.load(file)
                return data
            data = load_data(local_dir+"/data/clean_records/" + CHANNEL + "_Channel",
                             str(r)+"_"+str(WINDOW_SIZE)+"_"+str(TIME_STEP)+"_rw_nf.pkl")
            
            # Seems to extract and transform data prior to actually running the model on it
            sample = data[0, 0:360].reshape(1, 360, 1)
            results = model.predict(sample)

            # Seems to post processing results
            np.argmax(results)
            annotation = list(CLASSIFICATION.keys())[np.argmax(results)]

            # Actual integration begins here (take results and serialize it as a dict)
            send_response = {"Annotation Classification for 360 unknown results": annotation}
            return Response(send_response, status=200)

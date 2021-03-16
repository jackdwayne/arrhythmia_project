from patientdb.models import Signals, Patient
from django.shortcuts import get_object_or_404
from patientdb.serializers import SignalsSerializer, PatientSerializer
from rest_framework import viewsets
from rest_framework.response import Response
import django_filters
from rest_framework import generics
from django_filters.rest_framework import DjangoFilterBackend

# Testing views
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


class test_model(APIView):
    def get(self, request):
        if request.method == 'GET':
            # Data for selecting the correct model and records, keep to allow for easy import of new models
            WINDOW_SIZE = 360
            TIME_STEP = 1
            EPOCHS = 1
            CHANNEL = 'MLII'
            local_dir = os.path.abspath('') + "/patientdb/LSTM_Classification"
            CLASSIFICATION = {' ': 0, 'N': 1, '"': 2, 'A': 3, 'E': 4, 'F': 5, 'J': 6, 'L': 7, '!': 8, 'Q': 9,
                              'R': 10, 'S': 11, 'V': 12, 'Z': 13, '[': 14, ']': 15, 'a': 16, 'e': 17, 'f': 18, 'j': 19}
            model = tf.keras.models.load_model(local_dir+ "/LSTM_RW_Classification_"+str(WINDOW_SIZE)+"_e"+str(EPOCHS)+".h5")

            r = 100
            def load_data(local_dir, filename):
                print(local_dir + "/" + filename)
                with open(local_dir + "/" + filename, 'rb') as file:
                    data = pickle.load(file)
                return data

            data = load_data(local_dir+"/data/clean_records/" + CHANNEL + "_Channel",
                             str(r)+"_"+str(WINDOW_SIZE)+"_"+str(TIME_STEP)+"_rw_nf.pkl")
            sample = data[0, 0:360].reshape(1, 360, 1)
            results = model.predict(sample)
            np.argmax(results)
            annotation = list(CLASSIFICATION.keys())[np.argmax(results)]
            send_response = {"Annotation Classification for 360 unknown results": annotation}
            return Response(send_response, status=200)

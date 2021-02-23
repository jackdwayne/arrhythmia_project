from patientdb.models import Signals, Patient
from django.shortcuts import get_object_or_404
from patientdb.serializers import SignalsSerializer, PatientSerializer
from rest_framework import viewsets
from rest_framework.response import Response
import django_filters
from rest_framework import generics
from django_filters.rest_framework import DjangoFilterBackend


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
            queryset = queryset.filter(time__range = time.split(','))

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


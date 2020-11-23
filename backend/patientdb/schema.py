import graphene
from graphene_django import DjangoObjectType
import django_filters
from .models import *
from graphene_django.filter import DjangoFilterConnectionField


def custom_range_filter_method(queryset, field_name, value):
    if value:
        queryset = queryset.filter(**{f'{field_name}__range': value.split(',')})
    return queryset


class SignalFilter(django_filters.FilterSet):
    time= django_filters.Filter(method=custom_range_filter_method)
    signal_record_name__record_name = django_filters.NumberFilter()

    class Meta:
        model = Signals
        fields = ( 
              'time',
              'signal_record_name__record_name',
              'signal_record_name',
              'mlii',
              'v5',
               )

class PatientNode(DjangoObjectType):
    class Meta:
        model = Patient
        filter_fields = ['record_name']
        interfaces = (graphene.relay.Node,)

class SignalNode(DjangoObjectType):
    class Meta:
        model = Signals
        filterset_class = SignalFilter
        fields = ( 
              'time',
              'signal_record_name__record_name',
              'signal_record_name',
              'mlii',
              'v5',
               )
        interfaces = (graphene.relay.Node,)

class Query(object):
    patient = graphene.Node.Field(PatientNode)
    all_patients = DjangoFilterConnectionField(PatientNode)      
    signal = graphene.Node.Field(SignalNode)
    all_signals= DjangoFilterConnectionField(SignalNode)    

    
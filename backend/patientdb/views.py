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


# @csrf_exempt
# @api_view(['GET', 'POST', 'DELETE'])
# def patient_list(request):
#     if request.method == 'GET':
#         try:(signals, many=True, read_only=True)
#           patients = Patient.objects.all()
#           patient_serializer = PatientSerializer(patients, many=True)

#           response = {
#              'message': "Get all patients'Infos Successfully",
#              'patients': patient_serializer.data,
#              'error': ""
#           }
#           return JsonResponse(response, status=status.HTTP_200_OK);
#         except: 
#           error = {
#             'message': "Fail! -> can NOT get all the patients List. Please check again!",
#             'patients': "[]",
#             'error': "Error"
#           }
#           return JsonResponse(error, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
 
#     elif request.method == 'POST':
#         try:
#             patient_data = JSONParser().parse(request)
#             patient_serializer = PatientSerializer(data=customer_data)
            
#             if patient_serializer.is_valid():
#                 patient_serializer.save()
#                 print(patient_serializer.data)
#                 response = {
#                    'message': "Successfully Upload a Patient with id = %d" % patient_serializer.data.get('id'),
#                    'patients': [patient_serializer.data],
#                    'error': "" 
#                 }
#                 return JsonResponse(response, status=status.HTTP_201_CREATED)
#             else:
#                 error = {
#                     'message':"Can Not upload successfully!",
#                     'patients':"[]",
#                     'error': patient_serializer.errors
#                 }
#                 return JsonResponse(error, status=status.HTTP_400_BAD_REQUEST)
#         except: 
#             exceptionError = {
#                     'message': "Can Not upload successfully!",
#                     'patients': "[]",
#                     'error': "Having an exception!"
#                 }
#             return JsonResponse(exceptionError, status=status.HTTP_500_INTERNAL_SERVER_ERROR);
    
#     elif request.method == 'DELETE':
#         try:
#             Patient.objects.all().delete()
#             return HttpResponse(status=status.HTTP_204_NO_CONTENT)
#         except:
#             exceptionError = {
#                     'message': "Can Not Deleted successfully!",
#                     'patients': "[]",
#                     'error': "Having an exception!"
#                 }
#             return JsonResponse(exceptionError, status=status.HTTP_500_INTERNAL_SERVER_ERROR);

# @csrf_exempt
# @api_view(['GET', 'POST', 'DELETE'])
# def signals_list(request):
#     if request.method == 'GET':
#         try:
#           signals = Signals.objects.prefetch_related("signal_record_name").filter(signal_record_name=4)
#           signal_serializer = SignalsSerializer(signals, many=True, read_only=True)

#           response = {
#              'message': "Get all signals'Infos Successfully",
#              'signals': signal_serializer.data,
#              'error': ""
#           }
#           return JsonResponse(response, status=status.HTTP_200_OK)
#         except: 
#           error = {
#             'message': "Fail! -> can NOT get all the signals List. Please check again!",
#             'signals': "[]",
#             'error': "Error"
#           }
#           return JsonResponse(error, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
 
#     elif request.method == 'POST':
#         try:
#             signals_data = JSONParser().parse(request)
#             signal_serializer = SignalsSerializer(data=signals_data)
            
#             if signal_serializer.is_valid():
#                 signal_serializer.save()
#                 print(signal_serializer.data)
#                 response = {
#                    'message': "Successfully Upload a Patient with id = %d" % signal_serializer.data.get('id'),
#                    'signals': [signal_serializer.data],
#                    'error': "" 
#                 }
#                 return JsonResponse(response, status=status.HTTP_201_CREATED)
#             else:
#                 error = {
#                     'message':"Can Not upload successfully!",
#                     'signals':"[]",
#                     'error': customer_serializer.errors
#                 }
#                 return JsonResponse(error, status=status.HTTP_400_BAD_REQUEST)
#         except: 
#             exceptionError = {
#                     'message': "Can Not upload successfully!",
#                     'signals': "[]",
#                     'error': "Having an exception!"
#                 }
#             return JsonResponse(exceptionError, status=status.HTTP_500_INTERNAL_SERVER_ERROR);
    
#     elif request.method == 'DELETE':
#         try:
#             Signals.objects.all().delete()
#             return HttpResponse(status=status.HTTP_204_NO_CONTENT)
#         except:
#             exceptionError = {
#                     'message': "Can Not Deleted successfully!",
#                     'signals': "[]",
#                     'error': "Having an exception!"
#                 }
#             return JsonResponse(exceptionError, status=status.HTTP_500_INTERNAL_SERVER_ERROR);


# @csrf_exempt
# @api_view(['GET'])
# def signals_list_time(request, record_name, time):
#     try:
#         signals = Signals.objects.filter(**{f'{field_name}__range': value.split(',')}
        
#         if request.method == 'GET': 
#             customers_serializer = CustomerSerializer(customers, many=True)
#             response = {
#                 'message': "Successfully filter all Customers with age = %s" % age,
#                 'customers': customers_serializer.data,
#                 'error': ""
#             }
#             return JsonResponse(response, safe=False)
#             # In order to serialize objects, we must set 'safe=False'
#     except:
#         exceptionError = {
#                 'message': "Fail to get a Customer with age = %s" % age ,
#                 'customers': "[]",
#                 'error': "Raise an Exception!"
#             }
#         return JsonResponse(exceptionError, status=status.HTTP_500_INTERNAL_SERVER_ERROR);
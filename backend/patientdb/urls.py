from django.urls import path
from django.conf.urls import url
from patientdb import views
from rest_framework.routers import DefaultRouter
from .views import UploadedFileViewSet
from rest_framework import generics

router = DefaultRouter()
router.register(r'signals', views.SignalsViewSet)
router.register(r'patients', views.PatientViewSet)
#router.register(r'uploadPatient',  views.UploadedFileViewSet, basename='uploadPatient')

# Currently testing integrating ML into app, might be used in actual implementation
urlpatterns = [
    path('predict_mlii_signals/', views.Predict_Signals.as_view(),
         name='api_predict_mlii_signals'),
    path('uploadPatient/', views.UploadedFileViewSet.as_view(), name='uploadPatient')
]

# Combine router urls with other url patterns
urlpatterns += router.urls

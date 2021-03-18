from django.conf.urls import url 
from patientdb import views 
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'signals', views.SignalsViewSet)
router.register(r'patients', views.PatientViewSet)

# Currently testing integrating ML into app, might be used in actual implementation
from django.urls import path
urlpatterns = [
    path('predict_mlii_signals/', views.Predict_Signals.as_view(), name='api_predict_mlii_signals')
]

# Combine router urls with other url patterns
urlpatterns += router.urls
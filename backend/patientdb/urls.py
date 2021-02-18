from django.conf.urls import url 
from patientdb import views 
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'signals', views.SignalsViewSet)
router.register(r'patients', views.PatientViewSet)

urlpatterns = router.urls
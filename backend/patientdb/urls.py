from django.conf.urls import url 
from patientdb import views 
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'signals', views.SignalsViewSet)
router.register(r'patients', views.PatientViewSet)

# Currently testing integrating ML into app, might be used in actual implementation
from django.urls import path
urlpatterns = [
    path('test/', views.test_model.as_view(), name='test')
]

# Combine router urls with other url patterns
urlpatterns += router.urls
from django.conf.urls import url 
from patientdb import views 
 
urlpatterns = [ 
    url(r'^patients/$', views.patient_list),
    url(r'^signals/$', views.signals_list)
]
from django.db import models

# Create your models here.

class Patient(models.Model):
    record_name = models.IntegerField()
    n_sig = models.CharField(max_length=100, blank=True)
    fs = models.CharField(max_length=100, blank=True)
    counter_freq = models.CharField(max_length=100, blank=True)
    base_counter = models.CharField(max_length=100, blank=True) 
    sig_len = models.CharField(max_length=100, blank=True) 
    base_time = models.CharField(max_length=100, blank=True) 
    base_date = models.CharField(max_length=100, blank=True)
    comments = models.CharField(max_length=100, blank=True) 
    sig_name = models.CharField(max_length=100, blank=True) 
    p_signal = models.CharField(max_length=100, blank=True) 
    d_signal = models.CharField(max_length=100, blank=True) 
    e_p_signal = models.CharField(max_length=100, blank=True) 
    file_name = models.CharField(max_length=100, blank=True) 
    fmt = models.CharField(max_length=100, blank=True) 
    samps_per_frame = models.CharField(max_length=100, blank=True)
    skew  = models.CharField(max_length=100, blank=True)
    byte_offset = models.CharField(max_length=100, blank=True) 
    adc_gain = models.CharField(max_length=100, blank=True) 
    baseline = models.CharField(max_length=100, blank=True) 
    units = models.CharField(max_length=100, blank=True) 
    adc_res = models.CharField(max_length=100, blank=True) 
    adc_zero = models.CharField(max_length=100, blank=True) 
    init_value = models.CharField(max_length=100, blank=True)       
    checksum = models.CharField(max_length=100, blank=True) 
    block_size = models.CharField(max_length=100, blank=True)
    
    def __int__(self):
        return self.record_name

class Signals(models.Model):
    signal_record_name = models.ForeignKey(Patient, related_name='signal_record_name', on_delete=models.CASCADE)
    time = models.FloatField()
    mlii = models.FloatField()
    v5 = models.FloatField()
    def __int__(self):
        return self.signal_record_name

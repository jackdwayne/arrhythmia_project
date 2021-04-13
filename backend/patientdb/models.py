from django.db import models

# Create your models here.

class Patient(models.Model):
    record_name = models.IntegerField(primary_key = True)
    n_sig = models.CharField(max_length=1000, blank=True, null=True)
    fs = models.CharField(max_length=1000, blank=True, null=True)
    counter_freq = models.CharField(max_length=1000, blank=True, null=True)
    base_counter = models.CharField(max_length=1000, blank=True, null=True) 
    sig_len = models.CharField(max_length=1000, blank=True, null=True) 
    base_time = models.CharField(max_length=1000, blank=True, null=True) 
    base_date = models.CharField(max_length=1000, blank=True, null=True)
    comments = models.CharField(max_length=1000, blank=True, null=True) 
    sig_name = models.CharField(max_length=1000, blank=True, null=True) 
    #p_signal = models.CharField(max_length=1000, blank=True, null=True) 
    d_signal = models.CharField(max_length=1000, blank=True, null=True) 
    e_p_signal = models.CharField(max_length=1000, blank=True, null=True) 
    file_name = models.CharField(max_length=1000, blank=True, null=True) 
    fmt = models.CharField(max_length=1000, blank=True, null=True) 
    samps_per_frame = models.CharField(max_length=1000, blank=True, null=True)
    skew  = models.CharField(max_length=1000, blank=True, null=True)
    byte_offset = models.CharField(max_length=1000, blank=True, null=True) 
    adc_gain = models.CharField(max_length=1000, blank=True, null=True) 
    baseline = models.CharField(max_length=1000, blank=True, null=True) 
    units = models.CharField(max_length=1000, blank=True, null=True) 
    adc_res = models.CharField(max_length=1000, blank=True, null=True) 
    adc_zero = models.CharField(max_length=100, blank=True, null=True) 
    init_value = models.CharField(max_length=1000, blank=True, null=True)       
    checksum = models.CharField(max_length=1000, blank=True, null=True) 
    block_size = models.CharField(max_length=1000, blank=True, null=True)
    has_annotations = models.CharField(max_length=1000, blank=True, null=True)
    def __int__(self):
        return self.record_name

class Signals(models.Model):
    signal_record_name = models.ForeignKey(Patient, related_name='signal_record_name', on_delete=models.CASCADE)
    time = models.CharField(max_length=1000, blank=True, null=True)
    # TODO: Update models to dynamically pick different types of lead
    #       Requires update to the database model though, which hasn't been made as of 3/30
    mlii = models.CharField(max_length=1000, blank=True, null=True)
    v5 = models.CharField(max_length=1000, blank=True, null=True)
    annotation = models.CharField(max_length=10, blank=True, null=True)
    def __int__(self):
        return self.id
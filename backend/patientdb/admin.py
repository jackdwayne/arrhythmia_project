from django.contrib import admin
from .models import *
# Register your models here.
class PatientAdmin(admin.ModelAdmin):
    fields = ("record_name", "n_sig", "fs", "counter_freq", "base_counter", "sig_len", "base_time", "base_date",
                  "comments", "sig_name", "p_signal", "d_signal", "e_p_signal", "file_name", "fmt", "samps_per_frame",
                  "skew", "byte_offset", "adc_gain", "baseline", "units", "adc_res", "adc_zero", "init_value",
                  "checksum", "block_size")

class SignalAdmin(admin.ModelAdmin):
    fields =('signal_record_name', 'time', 'mlii', 'v5')

admin.site.register(Patient, PatientAdmin)
admin.site.register(Signals, SignalAdmin)
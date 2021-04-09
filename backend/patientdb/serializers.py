from rest_framework import serializers
from patientdb.models import Patient, Signals
from rest_framework.parsers import MultiPartParser, FormParser


class UploadSerializer(serializers.Serializer):
    parser_classes = (MultiPartParser, FormParser,)
    #file = serializers.FileField(use_url=False)
    file = serializers.ListField(
        child=serializers.FileField(max_length=100000,
                                    allow_empty_file=False,
                                    use_url=False)
    )


class PatientSerializer(serializers.ModelSerializer):

    class Meta:
        model = Patient
        fields = ("record_name", "n_sig", "fs", "counter_freq", "base_counter", "sig_len", "base_time", "base_date",
                  "comments", "sig_name", "d_signal", "e_p_signal", "file_name", "fmt", "samps_per_frame",
                  "skew", "byte_offset", "adc_gain", "baseline", "units", "adc_res", "adc_zero", "init_value",
                  "checksum", "block_size", "has_annotations")


class SignalsSerializer(serializers.ModelSerializer):

    class Meta:
        model = Signals
        fields = ('signal_record_name', 'time', 'mlii', 'v5', 'annotation')

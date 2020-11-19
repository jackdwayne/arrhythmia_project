# Noah Jackson
# Testing MIT Data

import wfdb
import pandas as pd
import numpy as np
import os


# TODO: Parse MIT sample data
def printData(recordNumber):
    # build path to specific record
    filePath = 'mit-bih-arrhythmia-database-1.0.0/' + str(recordNumber)

    df_columns = ["record_name", "n_sig", "fs", "counter_freq", "base_counter", "sig_len", "base_time", "base_date",
                  "comments", "sig_name", "p_signal", "d_signal", "e_p_signal", "file_name", "fmt", "samps_per_frame",
                  "skew", "byte_offset", "adc_gain", "baseline", "units", "adc_res", "adc_zero", "init_value",
                  "checksum", "block_size"]

    formatted_patient_DF = pd.DataFrame(index=np.arange(1), columns=df_columns)

    # get specific record from MIT data set
    record = wfdb.rdrecord(filePath, sampfrom=800, channels=[1, 1])

    # get all attributes of record object and store in attributes
    attributes = vars(record)
    recordValue = 0

    # iterate through attributes
    for attr in attributes:
        # example of selecting specific data segment from record
        # if attr == "checksum":

        if attr == "record_name":
            recordValue = getattr(record, attr)
            formatted_patient_DF['record_name'].values[0] = getattr(record, attr)

        if attr == "n_sig":
            formatted_patient_DF['n_sig'].values[0] = getattr(record, attr)

        if attr == "fs":
            formatted_patient_DF['fs'].values[0] = getattr(record, attr)

        if attr == "counter_freq":
            formatted_patient_DF['counter_freq'].values[0] = getattr(record, attr)

        if attr == "base_counter":
            formatted_patient_DF['base_counter'].values[0] = getattr(record, attr)

        if attr == "sig_len":
            formatted_patient_DF['sig_len'].values[0] = getattr(record, attr)

        if attr == "base_time":
            formatted_patient_DF['base_time'].values[0] = getattr(record, attr)

        if attr == "base_date":
            formatted_patient_DF['base_date'].values[0] = getattr(record, attr)

        if attr == "comments":
            formatted_patient_DF['comments'].values[0] = getattr(record, attr)

        if attr == "sig_name":
            formatted_patient_DF['sig_name'].values[0] = getattr(record, attr)

        if attr == "p_signal":
            formatted_patient_DF['p_signal'].values[0] = getattr(record, attr)

        if attr == "d_signal":
            formatted_patient_DF['d_signal'].values[0] = getattr(record, attr)

        if attr == "e_p_signal":
            formatted_patient_DF['e_p_signal'].values[0] = getattr(record, attr)

        if attr == "file_name":
            formatted_patient_DF['file_name'].values[0] = getattr(record, attr)

        if attr == "fmt":
            formatted_patient_DF['fmt'].values[0] = getattr(record, attr)

        if attr == "samps_per_frame":
            formatted_patient_DF['samps_per_frame'].values[0] = getattr(record, attr)

        if attr == "skew":
            formatted_patient_DF['skew'].values[0] = getattr(record, attr)

        if attr == "byte_offset":
            formatted_patient_DF['byte_offset'].values[0] = getattr(record, attr)

        if attr == "adc_gain":
            formatted_patient_DF['adc_gain'].values[0] = getattr(record, attr)

        if attr == "baseline":
            formatted_patient_DF['baseline'].values[0] = getattr(record, attr)

        if attr == "units":
            formatted_patient_DF['units'].values[0] = getattr(record, attr)

        if attr == "adc_res":
            formatted_patient_DF['adc_res'].values[0] = getattr(record, attr)

        if attr == "adc_zero":
            formatted_patient_DF['adc_zero'].values[0] = getattr(record, attr)

        if attr == "init_value":
            formatted_patient_DF['init_value'].values[0] = getattr(record, attr)

        if attr == "checksum":
            formatted_patient_DF['checksum'].values[0] = getattr(record, attr)

        if attr == "block_size":
            formatted_patient_DF['block_size'].values[0] = getattr(record, attr)


    # write formatted patient data to csv
    writePatientCSV(formatted_patient_DF, recordValue)


def writePatientCSV(patientData_DF, rec_num):
    # getting current working directory where patient data will be written
    curWorDir = os.getcwd()
    print("\nrecordsValue: %s" % rec_num)
    # filename
    ptFormattedFile = curWorDir + "/" + "Formatted_Patient_Rec_" + str(rec_num)

    # write formatted patient data to new csv file
    patientData_DF.to_csv(ptFormattedFile, sep=',', encoding='utf-8', index=False)


if __name__ == '__main__':
    printData(214)

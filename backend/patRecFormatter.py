# Formatting and inserting MIT Data into database

import wfdb
import pandas as pd
import numpy as np
import os
import pathlib
from decimal import Decimal
from django.db import connections
import psycopg2
from contextlib import closing
import csv
from sqlalchemy import create_engine, types
import io
from psycopg2.extensions import register_adapter, AsIs


class dataParser(object):
        
    def addapt_numpy_array(self, numpy_array):
        return AsIs(tuple(numpy_array))

    register_adapter(np.ndarray, addapt_numpy_array)

    def start(self, filePath, file):
        tempDir = str(pathlib.Path().absolute()) + '/temp_uploaded_patient_data/'
        fileNameNoExtension = file._name.split('.')[0]  
        dataParser.getData(self, fileNameNoExtension, tempDir)
       

    # TODO: Parse MIT sample data
    def getData(self, fileNameNoExtension, filePath):
        
        # build path to specific record
        tempFilePath =  filePath + fileNameNoExtension
        df_columns = ["record_name", "n_sig", "fs", "counter_freq", "base_counter", "sig_len", "base_time", "base_date",
                    "comments", "sig_name", "d_signal", "e_p_signal", "file_name", "fmt", "samps_per_frame",
                    "skew", "byte_offset", "adc_gain", "baseline", "units", "adc_res", "adc_zero", "init_value",
                    "checksum", "block_size", "has_annotations"]

        formatted_patient_DF = pd.DataFrame(index=np.arange(1), columns=df_columns)

        # get specific record from MIT data set
        record = wfdb.rdrecord(tempFilePath)

        # get all attributes of record object and store in attributes
        attributes = vars(record)

        # initialize record value for later use
        recordValue = 0

        # will hold time series data for patient signal and mv
        p_signal_time = []
        signal_name = ""
  
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
                signal_name = getattr(record, attr)

            if attr == "p_signal":
                p_signal_time = getattr(record, attr)

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


        timeDF = dataParser.extractTimeData(self, p_signal_time, signal_name, recordValue)
        dataParser.extractAnnotations(self, filePath, timeDF, fileNameNoExtension)
        dataParser.writePatientCSV(self, formatted_patient_DF, recordValue, 'All_Attributes_', 0)
        dataParser.insertInDatabase(self, filePath, fileNameNoExtension)


    def insertInDatabase(self, filePath, recordNum):
        dbConn = psycopg2.connect(host="localhost", port="5432", dbname="patient_db", user="postgres", password="postgres")

        dbCursor = dbConn.cursor()

        attrFile = filePath + "All_Attributes_" + recordNum + ".csv"
        signalFile = filePath + "TimeData_" + recordNum + ".csv"
        patientAttributes = ["record_name", "n_sig", "fs", "counter_freq", "base_counter", "sig_len", "base_time", "base_date",
                    "comments", "sig_name", "d_signal", "e_p_signal", "file_name", "fmt", "samps_per_frame",
                    "skew", "byte_offset", "adc_gain", "baseline", "units", "adc_res", "adc_zero", "init_value",
                    "checksum", "block_size", "has_annotations"]
       
        signalAttributes = ["time", "mlii", "v5", "signal_record_name_id", "annotation"]

        # try to open file containing patients attribute data
        try:
            attrFileData = open(attrFile, 'r')

        # check for error opening attribute file 
        except psycopg2.Error as e:
            print("\nerror opening file %s: %s\n" %(attrFile, e))
            return 

        # Insert attribute data into patientdb_patient table 
        try:
            print("\ninserting patient %s's attributes into patientdb_patient...............\n" % recordNum)
            dbCursor.copy_from(attrFileData, "patientdb_patient", columns=patientAttributes, sep="|")
            dbConn.commit()

        # Check for errors inserting attribute data 
        except psycopg2.Error as e:
            print("\nerror inserting into patientdb_patient: %s\n" % e)
            return


        # check for error opening signals file 
        try:
            signalFileData = open(signalFile, 'r')

        # check for error opening attribute file 
        except psycopg2.Error as e:
            print("\nerror opening file %s: %s\n" %(signalFile, e))
            return 

        # Insert attribute data into patientdb_signals table 
        try:
            print("\ninserting patient %s's signal data into patientdb_signals...............\n" % recordNum)
            dbCursor.copy_from(signalFileData, "patientdb_signals", columns=signalAttributes, sep=",")
            dbConn.commit()

        # Check for errors inserting signal data 
        except psycopg2.Error as e:
            print("\nerror inserting into patientdb_signals inserting: %s\n" % e)
            return

        # Close database connection 
        dbCursor.close()
        dbConn.close()


    def extractAnnotations(self, filePath, timeDF, recordNumber):
        # build path to annotations
        newFilePath =  filePath + recordNumber

        # get specific record from MIT data set
        ann = wfdb.rdann(newFilePath, 'atr')
        
        # get all attributes of record object and store in attributes
        attributes = vars(ann)

        dfCounter = 0
        annoCounter = 0
        lenAnno = len(attributes["sample"])

        while annoCounter < lenAnno:
            annoIndex = attributes["sample"][annoCounter]
            tempTime = 0.0027777777777777777777777777 * annoIndex
            annoTime = round(tempTime, 3)

            if annoTime == timeDF["time"][dfCounter]:
                # print("\nannoTime: %f\ttimeDF time: %f\n" % (annoTime, timeDF["time"][dfCounter]))
                timeDF["annotation"][dfCounter] = attributes["symbol"][annoCounter]
                annoCounter += 1
            
            dfCounter += 1

        dataParser.writePatientCSV(self, timeDF, recordNumber, "TimeData_", 1)


    def extractTimeData(self, p_signal_time, signal_name, record_value):
        #df_columns = dataParser.buildTimeDFCol(self, signal_name)
        df_columns = ['time', 'mlii', 'v5', 'signal_record_name_id', 'annotation']
        formatted_pt_time_DF = pd.DataFrame(index=np.arange(650000), columns=df_columns)
        time = 0.0
        tempTime = 0.0
        count = 0

        for element in p_signal_time:
            formatted_pt_time_DF["signal_record_name_id"].values[count] = record_value
            formatted_pt_time_DF["time"].values[count] = time

            formatted_pt_time_DF[df_columns[1]].values[count] = element[0]

            formatted_pt_time_DF[df_columns[2]].values[count] = float(element[1])
            tempTime += 0.0027777777777777777777777777
            time = round(tempTime, 3)
            count += 1
        return formatted_pt_time_DF
    
    # will dynamically build list of columns for signals of patient record
    def buildTimeDFCol(self, signalNames):
        df_columns = ["time"]
        count = 1

        for element in signalNames:
            df_columns.append(element)
            count += 1

        df_columns.append("signal_record_name_id")
        df_columns.append("annotation")
        i = 0
        while i < len(df_columns):
            df_columns[i] = df_columns[i].lower()
            i += 1
        
        for x in df_columns:
            print('\nx: %s\n' % x)

        return df_columns


    def writePatientCSV(self, patientData_DF, rec_num, fileName, signalOrPatient):

        # getting current working directory where patient data will be written
        tempDir = str(pathlib.Path().absolute()) + '/temp_uploaded_patient_data/'

        # filename
        ptFormattedFile = tempDir + fileName + str(rec_num) + ".csv"

        # when signalOrPatient is equal to 1, then it is the signal data frame so use comma as delimiter 
        if signalOrPatient == 1:
            # write formatted patient data to new csv file
            patientData_DF.to_csv(ptFormattedFile, sep=',', encoding='utf-8', index=False, header=False, quoting=0)

        # when signalOrPatient is equal to 0, then it is the patient attributes data frame so use | as delimiter
        if signalOrPatient == 0:
            # write formatted signal data to new csv file
            patientData_DF.to_csv(ptFormattedFile, sep='|', encoding='utf-8', index=False, header=False, quoting=0)


    
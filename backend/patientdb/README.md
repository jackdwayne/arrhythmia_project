# Heart Arrhythmia Project - backend/patientdb
Contains specifications on database schema, database queries, patientdb url endpoints, and views of the Django server.

Main components of patientdb app:
- models.py
    Informs the Django server of the database schema. Modifying a model in this file will require
    applying new migrations to the database by running the following commands while in the backend folder:
        python3 manage.py makemigrations
        python3 manage.py migrate
    Depending on the significance of the changes, the database may need to remade before applying migrations.
- serializers.py
    Handles the pagination of querying patient signal data for faster and more responsive output in the frontend.
- urls.py
    Manages patientdb app url endpoints.
- views.py
    Manages the various views in the Django server that can be accessed from patientdb url endpoints. 
    Certain views are also used to manage queries from the database.
    (Currently a workaround in the cors origin response)

## Working With Machine Learning Model
This app is currently capable of interacting with one machine learning model, which is contained in the 
LSTM_Classification folder, using data contained in querys of patient signal data. The machine learning
model in the LSTM_Classification folder can be used to generate annotation predictions over 1 second intervals.
To do this, the machine learning model expects an input in the format of a list of N sample sets of 360 samples each
(which corresponds to one second of data; format shown below)

[
    sample set 0: 
    [
        sample 0: [val]
        sample 1: [val]
        .
        .
        .
        sample 359 [val]
    ]
    sample set 1: 
    [
        sample 0: [val]
        sample 1: [val]
        .
        .
        .
        sample 359 [val]
    ]
    .
    .
    .
    sample set N: 
    [
        sample 0: [val]
        sample 1: [val]
        .
        .
        .
        sample 359 [val]
    ]
]

The machine learning model is currently used in the Predict_Signals view contained in views.py (query will need to change
with attribute changes in models.py).
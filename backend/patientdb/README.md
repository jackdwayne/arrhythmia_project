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

## Restful API
Django handles url endpoints by assigning them views (custom vies can be defined in views.py), which can contain 
functions named after various HTTP request types (e.g. GET, POST, HEAD, etc.) that handle said requests, 
possibly by querying the database that the Django server is connected to and/or processing said query and returning 
the results as a HTTP response.

## Working With Machine Learning Model
This app is currently capable of interacting with one machine learning model, which is contained in the 
LSTM_Classification folder, using data contained in querys of patient signal data. The machine learning
model in the LSTM_Classification folder can be used to generate annotation predictions over 1 second intervals.
To do this, the machine learning model expects an input in the format of a list of N sample sets of 360 samples each
(corresponding to one second of data; format shown below).

[  
    sample set 0:  
    [
        sample 0: [val],
        sample 1: [val],
        .
        .
        .
        sample 359 [val]
    ],  
    sample set 1:  
    [
        sample 0: [val],
        sample 1: [val],
        .
        .
        .
        sample 359 [val]
    ],  
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

Given an input following this format, the machine learning model will return either one one-hot encoding corresponding to an annotation

The machine learning model is currently used in the Predict_Signals view contained in views.py 
(query will need to change with attribute changes in models.py).

Additional (trained) machine learning models to the backend (more on adding trained models below) 
can be used with data gathered with queries to the database, then predicted annotations can be sent to the frontend
with a HTTP response similar to the one in the predict signals view in views.py.

## Adding Trained Machine Learning Models to Backend
Any trained model can be added to the backend by placing it somewhere in the backend folder 
(which is considered as the working directory, obtainable by calling os.path.abspath(''))
or any of its subdirectories. The Django server can then interact with the model using data
from the database it is connected to, assuming additional dependencies for the model are installed
and the data queried is formatted correctly to be interpreted by the model.
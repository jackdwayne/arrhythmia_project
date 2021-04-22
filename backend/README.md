# Heart Arrhythmia Project - backend
Contains the working parts of the Django server to be run alongside the React frontend,
as well as a virtual python environment and collection of data dumps to restore a postgresql database.

Dependencies:
- django
- djangorestframework
- django-filter
- django-rest-auth
- django-cors-headers
- django-debug-toolbar
- gunicorn
- joblib
- psycopg2-binary
- scikit-learn
- sqlalchemy
- tensorflow
- tensorflow-addons
- wfdb

The django server is organised in two app folders:
- mainapp
    Contains settings for the Django server and manages url endpoints.
- patientdb
    Contains specifications on database schema, database queries, patientdb url endpoints, and views of the Django server.
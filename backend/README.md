# Heart Arrhythmia Project - backend
Contains the working parts of the Django server to be run alongside the React frontend,
as well as a virtual python environment and collection of data dumps to restore a postgresql database.

The django server is organised in two app folders:
- mainapp
    Contains settings for the Django server and manages url endpoints.
- patientdb
    Contains specifications on database schema, database queries, patientdb url endpoints, and views of the Django server.
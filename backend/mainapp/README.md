# Heart Arrhythmia Project - backend/mainapp
Contains settings for the Django server and manages url endpoints.

Main components of mainapp:
- settings.py
    Contains numerous settings for setting up and running the Django server.

    Main settings of interest in settings.py:
    - ALLOWED_HOSTS: list of valid hosts for the Django server
    - INSTALLED_APPS: list of Django apps to be used within the server 
        (a new Django app can be created by running 
         "python3 manage.py startapp <appName>" while in the backend folder)
    - ROOT_URLCONF: contains the path to the urls file that all url endpoints are to be passed through
    - DATABASES: contains the settings for the Django server to connect to databases
        Note: the user specified must be an existing user in the database with permissions to modify
              the database with the same name as the name supplied in the name setting for a successful connection
    - CORS_ORIGIN_WHITELIST: needs to contain the valid hosts for the Django server
    - DEBUG_TOOLBAR_PANELS: list of Django toolbars for use in debugging (currently unused)
- urls.py
    Contains handlers that attempt to handle all url endpoints
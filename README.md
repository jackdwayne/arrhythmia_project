# arrhythmia_project
 Capstone Senior Project

## Description:
Cardiovascular diseases, such as myocardial infarction (heart attack) and congestive heart failure are the leading causes of death in the United States.Microbial sepsis, which is increasingly common in a time of rising antibiotic resistance, is the second most common cause of death in hospitals. Multiple and frequent hospital re-admissions within 30 days of discharge for non-specific decompensated congestive heart failure are an enormous drain on hospital resources and healthcare budgets. An inexpensive, non-invasive, and wearable “early warning” device predictive of impending cardiac decompensation (failure of the heart to accommodate a secondary condition such as sepsis) could be used as a telemedicine tool to continuously monitor ambulatory patients, whether hospitalized or otherwise. In case of adverse cardiovascular decline, such a solution would create a window of time in which to intervene to avertor mitigate the crisis, thereby saving many lives and much treasure.
An interdisciplinary team (ME + CS) will work together to design a hardware-software platform to monitor heart beats.
For CS side, the requirements are: 1)Develop a data analysis software which a.visualize sensor data streams collected from the heart monitor;b.performs anomaly detection using machine learning models;c.has a user-friendly interface for non-CS users;2)An analysis on the performance of different models;3)If time permitted, optimize the system for the purpose of pseudo real-time detection.
The team can work on the MIT open source dataset (https://physionet.org/content/mitdb/1.0.0/) to getstarted, before our data becomes available from Rowan collaborators. 

## Setup:
    1) INSTALL YOUR TOOLS:

    Install Python:
        Windows:
        > https://www.python.org/downloads/
        Ubuntu:
        >$ sudo apt install python3
        >$ python ––version

    Install Node.JS:
        Windows:
        > https://nodejs.org/en/download/
        > install with the downloaded windows installer
        > if issues occur, check path variables
        Ubuntu:
        >$ sudo apt install nodejs
        >$ sudo apt install npm
        >$ nodejs -v

    Install Django:
        Windows:
        >$ py -m pip install Django
        Make sure to update path variables to run the djando-admin script
        Ubuntu:
        >$ sudo apt install python3-django

    2) SET UP YOUR POSTGRESQL SERVER

        Go here to download the correct server for your OS: https://www.postgresql.org/download/. Once you have a postgresql server up and running locally on port 5432, you will need to use the GUI tool PGadmin4 or the command line tool pg_restore to restore the latest data dump into the database. The dump can be found in backend/data-dump.

    3) GET THE REPO: 

    Clone repo:
        >$ git clone https://github.com/jackdwayne/arrhythmia_project.git

    4) BUILD THE PROJECT

    Virtual environment setup:
    navigate to the backend folder and run these commands

        >$ sudo apt-get install python3-venv
        >$ python3 -m venv mypthonenv
        >$ source mypythonenv/bin/activate
        >$ pip3 install django djangorestframework django-filter django-rest-auth django-cors-headers psycopg2-binary pandas scikit-learn joblib gunicorn django-debug-toolbar tensorflow tensorflow-addons wfdb

    NOTE: you may need to install tensorflow again because of a numpy dependency problem during isntallation. Easy fix

    Now, navigate to the frontend folder and run

    With yarn:
        > $ yarn install
    With npm:
        > $ npm install

    Your frontend dependencies and backend dependencies are now built correctly. Lastly, go to the LSMT_CLASSIFICATION directory and unzip the .zip file to the patient_db directory.

    5) RUN THE PROJECT

    cd in one terminal to backend WHILE INSIDE PYTHON VENV:
        >$ python manage.py runserver
    cd in another terminal to frontend:
        >$ yarn start
        or
        >$ npm start

## Building Docker Image (Currently Deprecated)

Assuming docker is installed in your system:  

    ```bash
    # To build an image
    docker-compose build
    # To run the image
    docker-compose up
    # To stop the image
    docker-compose stop
    ```

If the image is up:
* The backend will be located in localhost:8000
* The frontend will be located in localhost:3000

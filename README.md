# arrhythmia_project
 Capstone Senior Project

## Description:
Cardiovascular diseases, such as myocardial infarction (heart attack) and congestive heart failure are the leading causes of death in the United States.Microbial sepsis, which is increasingly common in a time of rising antibiotic resistance, is the second most common cause of death in hospitals. Multiple and frequent hospital re-admissions within 30 days of discharge for non-specific decompensated congestive heart failure are an enormous drain on hospital resources and healthcare budgets. An inexpensive, non-invasive, and wearable “early warning” device predictive of impending cardiac decompensation (failure of the heart to accommodate a secondary condition such as sepsis) could be used as a telemedicine tool to continuously monitor ambulatory patients, whether hospitalized or otherwise. In case of adverse cardiovascular decline, such a solution would create a window of time in which to intervene to avertor mitigate the crisis, thereby saving many lives and much treasure.
An interdisciplinary team (ME + CS) will work together to design a hardware-software platform to monitor heart beats.
For CS side, the requirements are: 1)Develop a data analysis software which a.visualize sensor data streams collected from the heart monitor;b.performs anomaly detection using machine learning models;c.has a user-friendly interface for non-CS users;2)An analysis on the performance of different models;3)If time permitted, optimize the system for the purpose of pseudo real-time detection.
The team can work on the MIT open source dataset (https://physionet.org/content/mitdb/1.0.0/) to getstarted, before our data becomes available from Rowan collaborators. 

## Setup:
    ##### Virtual environment setup:
    sudo apt-get install python3-venv
    python3 -m venv mypthonenv
    source mypythonenv/bin/activate
    pip3 install django djangorestframework django-filter django-rest-auth django-cors-headers psycopg2-binary pandas scikit-learn joblib gunicorn django-debug-toolbar

    Install backend:
        cd to /backend/django_app
        pip install requirements.txt
    ###### Install Python:
        Windows:
        > https://www.python.org/downloads/
        Ubuntu:
        >$ sudo apt install python3
        >$ python ––version

    ###### Install Node.JS:
        Windows:
        > https://nodejs.org/en/download/
        > install with the downloaded windows installer
        > if issues occur, check path variables
        Ubuntu:
        >$ sudo apt install nodejs
        >$ sudo apt install npm
        >$ nodejs -v

    ###### Install Django:
        Windows:
        >$ py -m pip install Django
        Make sure to update path variables to run the djando-admin script
        Ubuntu:
        >$ sudo apt install python3-django

        Other installs:
        >$ pip3 install django-cors-headers
        >$ pip3 install graphene-django
        >$ pip3 install graphene-django
        >$ pip3 install psycopg2-binary
        >$ pip3 install django-filter


    ###### Clone repo:
        >$ git clone https://github.com/jackdwayne/arrhythmia_project.git

    ###### Dependancy Setup:
    In terminal or code cd to frontend folder
        With yarn:
            > $ yarn
        With npm:
            > $ npm install

    ###### How to run locally:
    cd in one terminal to backend:
        >$ python manage.py runserver
    cd in another terminal to frontend:
        >$ yarn start
        or
        >$ npm start

## Building Docker Image

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
* The backend will be located in localhost:8000/graphql
* The frontend will be located in localhost:3000

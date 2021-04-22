A lot of the code involving sending queries/processing data is being done inside of DefaultDisplay.js. It is also the largest file of all the React Components, so start studying that component first if you are trying to optimize the frontend. 

## Contents

AllPatients.js - Componenet that displays all patients currently inside the database inside of a table. Lists information like patient number, age, gender, number of data points and the types of leads in the data. Appears when users select the "All patients" tab
Chart.js - Contains the CanvasJS stockchart and displays the data as a line chart. This component is imported into DefaultDisplay.js
Dashboard.js - High level component that is imported into App.js. This component acts as the parent componenet for every other rendered component.
DefaultDispaly.js - This is where most of the work was completed during the capstone. This component uses all the queries in graphql-logic and handles passing the data off to the chart componenet. Processing also happens here to format the data correctly and contains handlers for buttons that dynmically render the component to display different patients and machine-learning annotations. Appears when users select the "Dashboard" tab.
GraphForms.js - Is not currently used, was supposed to replace the buttons and event handlers in DefaultDisplay.
MainList.js - Main menu that appears to the left of the application and lets users navigate between different tabs of the application. Contains three items "Dashboard", "All Patients", and "Upload New Patient".
Patient.js - Similiar to AllPatient.js, displays all information about a single patient in a table, but displays information for only one patient, not all avaliable patients.
Title.js - Small compoenent that renders in the title of the application
Users.js - An innapropriately named component, this compoenent actually allows users to upload new patient information from the MIT arrhythmia database, which can be located at https://physionet.org/content/mitdb/1.0.0/. This component appears when users select the "Upload new patient" tab.
canvasjs.stock.min.js/canvasjs.stock.react.js - Needed to use the CanvasJS library, these files are not to be edited, leave them as they are. 
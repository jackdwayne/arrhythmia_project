# Documentation

A lot of the code involving sending queries/processing data is being done inside of DefaultDisplay.js. It is also the largest file of all the React Components, so start studying that component first if you are trying to optimize the frontend.

## Contents

    components/
    ├── AllPatients.js              # Component that displays all patients currently inside the database inside of a table.
    ├── Chart.js                    # Contains the CanvasJS stockchart and displays the data as a line chart.
    ├── Dashboard.js                # This component acts as the parent component for every other rendered component.
    ├── DefaultDisplay.js           # This component uses all the queries in graphql-logic and handles passing the data off to the chart component.
    ├── GraphForms.js               # Is not currently used, planned to replace the buttons and event handlers in DefaultDisplay.
    ├── MainList.js                 # Allows users navigate between different tabs of the application on the left.
    ├── Patient.js                  # Displays all information about a single patient in a table.
    ├── README.md                   # Documentation (this file)
    ├── Title.js                    # Small component that renders in the title of the application.
    ├── Users.js                    # Allows users to upload new patient information from the MIT arrhythmia database,
    ├── canvasjs.stock.min.js       # Needed for Chart, do not to be edit.
    └── canvasjs.stock.react.js     # Needed for Chart, do not to be edit.

### Additional Notes on Specific Files

- **AllPatients.js** - Lists information like patient number, age, gender, number of data points and the types of leads in the data. Appears when users select the "All patients" tab

- **DefaultDisplay.js** - _As is, it is too big of a file, and needs to be broken up_. This is where most of the work was completed during the capstone. Processing also happens here to format the data correctly and contains handlers for buttons that dynamically render the component to display different patients and machine-learning annotations. Appears when users select the "Dashboard" tab.

- **Users.js** - An inappropriately named component, this component actually allows users to upload new patient information from the MIT arrhythmia database, which can be located at https://physionet.org/content/mitdb/1.0.0/. This component appears when users select the "Upload new patient" tab.

## Contents
    src/
    ├── App.css
    ├── App.js
    ├── App.test.js
    ├── README.md
    ├── components
    ├── graphql-logic
    ├── index.css
    ├── index.js
    ├── logo.svg
    ├── reportWebVitals.js
    └── setupTests.js

components - Folder containing all of the react components that are rendered into the web browser
graphql-logic - A single js file that is imported into components/DefaultDisplay.js. These are the queries that are used to query a patient, the patient's arrhythmia signals, and query the Tensorflow machine-learning predictions for the signals. It would be advised to not mess with these, but add new queries as you need them. 
App.css - some simple styling 
App.js - React component that contains the Dashboard, a very high level component that is a parent to almost every other React component besides the Apollo client.
App.test.js - Auto-generated file that came with the default React Project. Is not currently used
index.css - auto-generated css styling
index.js - The root of the entire application, wraps the App component in an Apollo client object
logo.svg - Website logo, has been left as the React logo for now, but can be changed to something more relevant to heart arryhthmia
reportWebVitals.js - Auto-generated file that came with the default React Project. Is not currently used
setupTests.js - Auto-generated file that came with the default React Project. Is not currently used
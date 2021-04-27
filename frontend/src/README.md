# Documentation

## Contents

    src/
    ├── App.css                 # Some simple styling
    ├── App.js                  # React component that contains the Dashboard
    ├── App.test.js             # Auto-generated file. Not used currently
    ├── README.md               # Documentation (this file right here)
    ├── components              # Folder containing all of the react components
    ├── graphql-logic           # A single js file that is imported into components/DefaultDisplay.js.
    ├── index.css               # Auto-generated css styling
    ├── index.js                # The root of the entire application, wraps the App component in an Apollo client object
    ├── logo.svg                # Website logo, left as the React logo for now.
    ├── reportWebVitals.js      # Auto-generated file. Not used currently
    └── setupTests.js           # Auto-generated file. Not used currently

### Additional Notes on Specific Files

- **graphql-logic** - These are the queries that are used to query a patient, the patient's arrhythmia signals, and query the Tensorflow machine-learning predictions for the signals. It would be advised to not mess with these, but add new queries as you need them.

- **App.js** A very high level component that is a parent to almost every other React component besides the Apollo client

- **logo.svg** - Can be changed to something more relevant to heart arrhythmia

## React Component Tree

Whole application is wrapped around the Apollo Client. The React component tree for passing props look like the following:

    ApolloClient
    └── App                         
        └── Dashboard               
            └── DefaultDisplay      
            |   ├── Chart           
            |   └── Patient        
            ├── MainList           
            ├── AllPatients        
            └── Users               

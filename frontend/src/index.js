import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import { RestLink } from "apollo-link-rest";

// Setup endpoint
// Documentation to refer to:
//      https://www.apollographql.com/docs/link/links/rest/
const restLink = new RestLink({
  endpoints: {
    signal: "http://localhost:8000/signals",
    patient: "http://localhost:8000/patients",
    predict: "http://localhost:8000/predict_mlii_signals",
  },
});

const client = new ApolloClient({
  link: restLink,
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

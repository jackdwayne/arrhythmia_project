import { gql } from "@apollo/client";
/* For GraphQL */
// Note: When specifying path, the path is concatenated with the rest link.
//       It is sensitive to characters such as '/'
// Note: endpoint location is found in App.js

// Signal Query
export const signalQuery = gql`
  query getPatient($qPath: String) {
    patient(qPath: $qPath)
      @rest(type: "Patient", path: $qPath, endpoint: "signal") {
      count
      next
      previous
      results
    }
  }
`;

// Annotation Prediction Query
export const predictQuery = gql`
  query getPrediction($pPath: String) {
    predict(pPath: $pPath)
      @rest(type: "Patient", path: $pPath, endpoint: "predict") {
      results
    }
  }
`;

// Patient Query
export const patientQuery = gql`
  query getPatient($pPath: String) {
    patients(qPath: $qPath)
      @rest(type: "Patients", path: $pPath, endpoint: "patient") {
      count
      next
      previous
      results
    }
  }
`;

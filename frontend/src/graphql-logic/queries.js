import { gql } from "@apollo/client";
/* For GraphQL */
// Note: When specifying path, the path is concatenated with the rest link.
//       It is sensitive to characters such as '/'
export const patientData = gql`
  query getPatient {
    patient
      @rest(
        type: "Patient"
        path: "signals/?format=json&signal_record_name=4&timeRange=0,30"
      ) {
      count
      next
      previous
      results
    }
  }
`;

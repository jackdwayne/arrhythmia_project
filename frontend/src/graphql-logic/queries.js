import { gql } from "@apollo/client";
/* For GraphQL */
// Note: When specifying path, the path is concatenated with the rest link.
//       It is sensitive to characters such as '/'
export const signalQuery = gql`
  query getPatient {
    patient
      @rest(
        type: "Patient"
        path: "/?format=json&signal_record_name=4&timeRange=0,30"
        endpoint: "signal"
      ) {
        count
        next
        previous
        results
    }
  }
`;

/* For GraphQL */
export const patientData = `query($patient: Int, $cursor: String){
  allSignals(signalRecordName_RecordName: $patient, time: "0,30", after:$cursor) {
    pageInfo {
      startCursor
      endCursor
      hasNextPage
      hasPreviousPage
    }
    edges {
      node {
        id
        time
        mlii
        v5
      }
    }
  }
}`;

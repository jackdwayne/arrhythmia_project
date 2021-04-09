import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
//import Chart from "./Chart";
import PatientTable from "./Patient";
import Title from "./Title";
import { useQuery, useLazyQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import Chart2 from "./Chart2";
import { Button, Input, MenuItem, Select } from "@material-ui/core";
import { patientQuery } from "../graphql-logic/queries";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

const signalQuery = gql`
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

const predictQuery = gql`
  query getPrediction($pPath: String) {
    predict(pPath: $pPath)
      @rest(type: "Patient", path: $pPath, endpoint: "predict") {
      results
    }
  }
`;

var request = new XMLHttpRequest();
request.open(
  "GET",
  "http://127.0.0.1:8000/predict_mlii_signals/?format=json&signal_record_name=103&lead=mlii&start=0&end=1800"
);
request.send();
request.onload = function () {
  var data = JSON.parse(request.response);
  console.log(data[0.5]);
};

// const signalQuery = gql`
//   query getPatient {
//     patient
//       @rest(
//         type: "Patient"
//         path: "/?format=json&signal_record_name_id=${patient_number}&timeRange=${start_time},${end_time}"
//         endpoint: "signal"
//       ) {
//       count
//       next
//       previous
//       results
//     }
//   }
// `;

let beats = [0.214, 1.028, 1.844, 2.631, 3.419, 4.206, 5.025];
let annotations = ["N", "N", "N", "N", "N", "N", "N"];
// Generate pairs of timestamps and readings
function createData(time, amount) {
  //return { time, amount };
  return { x: time, y: amount };
}

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 240,
  },
}));

export default function Sample() {
  const classes = useStyles();

  // TODO: Need to implement a component that picks up time range so that the user can query a specific time slot.
  //       (Currently hard-coded to pick up all data from all the time in the database)
  // TODO: Need to implement a better component that queries the db on the possible list of patients and allow the user
  //       to select the user using a drop-down
  // TODO: Need to implement a component that picks up a time range, and graph type to pick up a list of ML-based
  //       annotations
  // TODO: Need to implement dynamic queries for patient.
  // TODO: Update components that contain patient information (the tab, the dropdown, the update)
  // TODO: Make it dynamic (aka pick up attributes from components and concat them)

  // Data State
  const [dataPoint, setDataPoint] = useState({});

  // Selection states
  const [displayPatientNumber, setDisplayPatientNumber] = useState(0);
  const [patientNumber, setPatientNumber] = useState(0);

  // States to handle request string
  const [query, setQuery] = useState("");
  const [queryPath, setQueryPath] = useState(
    "/?format=json&signal_record_name="
  );
  const [predictionPath, setPredictionPath] = useState(
    "/?format=json&signal_record_name=103&lead=mlii&start=0&end=10"
  );
  const [patientListPath, setPatientListPath] = useState("/?format=json");
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);

  // Styling
  const [mlData, setMlData] = useState(0);
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  // State that handles queries for signals
  // TODO: Make it dynamic
  const [
    loadGraphs,
    {
      called: calledSig,
      loading: graphLoading,
      error: graphError,
      data: sigData,
      fetchMore,
    },
  ] = useLazyQuery(signalQuery, {
    variables: { qPath: queryPath.concat(String(patientNumber)) },
  });

  // State that handles queries for predictions on annotations from ML backend
  const [
    loadPredictions,
    {
      called: calledPred,
      loading: predictLoading,
      error: predictError,
      data: predictData,
    },
  ] = useLazyQuery(predictQuery, {
    variables: { pPath: predictionPath },
  });

  // State that handles queries for list of patients
  const [
    getPatientList,
    {
      called: calledPatients,
      loading: loadingPatients,
      data: patientLists,
      fetchMore: fetchMorePatients,
    },
  ] = useLazyQuery(patientQuery, { variables: { pPath: patientListPath } });

  // Update graph
  function updateGraph(data) {
    let signals = data.patient.results;
    console.log("In update graph");
    console.log(data);
    let next = data.patient.next;

    let MLIIdatapoints = [];
    let V5datapoints = [];
    let i = 0;

    for (i; i < signals.length; i++) {
      MLIIdatapoints.push(createData(signals[i].time, signals[i].mlii));
      V5datapoints.push(createData(signals[i].time, signals[i].v5));
    }
    return { ml2: MLIIdatapoints, v5: V5datapoints };
    //return { ml2: MLIIdatapoints, v5: V5datapoints, next: data.patient.next };
  }

  // Handler to set patient id
  const handleDisplayPatientSelect = (event) => {
    setDisplayPatientNumber(event.target.value);
  };

  const handlePatientSelect = () => {
    setPatientNumber(displayPatientNumber);
    setDataPoint(updateGraph(sigData));
  };

  // Handler to draw/update graph
  const handlePatientSubmit = (displayPatientNumber) => {
    if (displayPatientNumber !== 0) {
      setPatientNumber(displayPatientNumber);
      loadGraphs();
    }
  };

  //did mount or updated

  //const [next, setNext] = useState(0);

  // handleStartChange => (event) => {
  //     setStart(event.value)
  // }
  // handleEndChange => (event) => {
  //   setStart(event.value)

  const bull = <span className={classes.bullet}>•</span>;

  // Render Display Component
  if (!calledSig) {
    // Startup, select patient
    if (!calledPatients) {
      getPatientList();
      return <div>Loading...</div>;
    } else if (loadingPatients) {
      return <div>Loading...</div>;
    } else {
      return (
        <div>
          <Select
            placeholder="Choose Patient Record"
            onChange={handleDisplayPatientSelect}
            value={displayPatientNumber}
            autoWidth
          >
            {patientLists.patients.results.map((patient) => (
              <MenuItem value={patient.record_name}>
                {patient.record_name}
              </MenuItem>
            ))}
          </Select>
          <button onClick={() => handlePatientSubmit(displayPatientNumber)}>
            Submit
          </button>
        </div>
      );
    }
  } else if (calledSig && graphLoading) {
    return <div>Loading...</div>;
  } else {
    // Query made, render graph

    let signals = updateGraph(sigData);
    const patientComment = patientLists.patients.results.find(
      (patient) => patient.record_name === patientNumber
    );
    // Get age gender, and number of signal data points
    let summary = patientComment.comments
      .split("', ")
      .filter(function (str) {
        return /'*'/.test(str);
      })
      .map((x) => x.replace(/\[|\]|'/g, ""))[0]
      .split(" ")
      .slice(0, 2);
    summary = [
      ...summary,
      patientComment.sig_len,
      patientComment.sig_name.replace(/\[|\]|'/g, ""),
    ];
    const notes = patientComment.comments
      .split("', ")
      .filter(function (str) {
        return /'*'/.test(str);
      })
      .map((x) => x.replace(/\[|\]|'/g, ""))
      .slice(1);

    return (
      <div>
        {/* Select button */}
        <div>
          <Select
            placeholder="Choose Patient Record"
            onChange={handleDisplayPatientSelect}
            value={displayPatientNumber}
            autoWidth
          >
            {patientLists.patients.results.map((patient) => (
              <MenuItem value={patient.record_name}>
                {patient.record_name}
              </MenuItem>
            ))}
          </Select>
          <button onClick={() => handlePatientSelect()}>Submit</button>
        </div>
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            {/* Chart */}
            <Grid item xs={12} md={10} lg={12}>
              <Paper>
                <Title>ML II</Title>
                {/* <form onSubmit={handleJumpSubmit}>
              
              <input label="Start" onChange={setStart(this.value)}></input>
              <
            </form> */}
                <Chart2
                  key={1}
                  data={signals.ml2}
                  //annotations={annotations}
                />
              </Paper>
              {sigData.patient.previous && (
                <Button
                  onClick={() => {
                    fetchMore({
                      variables: {
                        qPath: sigData.patient.previous.slice(29),
                      },
                      updateQuery: (prevResult, { fetchMoreResult }) => {
                        return fetchMoreResult;
                      },
                    });
                  }}
                >
                  Load Previous
                </Button>
              )}
              {sigData.patient.next && (
                <Button
                  onClick={() => {
                    fetchMore({
                      variables: {
                        qPath: sigData.patient.next.slice(29),
                      },
                      updateQuery: (prevResult, { fetchMoreResult }) => {
                        return fetchMoreResult;
                      },
                    });
                  }}
                >
                  Load Next
                </Button>
              )}

              <Divider />
              <Paper>
                <Title>V5</Title>
                <Chart2 key={2} data={signals.v5} />
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Grid Container spacing={2}>
                <Grid item>
                  <PatientTable
                    patientID={patientNumber}
                    patient={summary}
                  ></PatientTable>
                </Grid>
                <Grid item>
                  <Card className={classes.root}>
                    <CardContent>
                      <Grid container spacing={4}>
                        <Grid item>
                          <Typography variant="h5" align="left">
                            Notes
                          </Typography>
                          {notes.map((comment) => (
                            <Typography
                              variant="h5"
                              color="textSecondary"
                              align="left"
                            >
                              {
                                // Getting patient notes from patient list given patient number
                                comment
                              }
                            </Typography>
                          ))}
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </div>
    );
  }
}

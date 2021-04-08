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
//import { signalQuery } from "../graphql-logic/queries";
import { gql } from "@apollo/client";
import Chart2 from "./Chart2";
import { Button, Input, MenuItem, Select } from "@material-ui/core";



const signalQuery = gql`
  query getPatient($qPath: String) {
    patient(qPath: $qPath)
      @rest(
        type: "Patient"
        path: $qPath
        endpoint: "signal"
      ) {
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
      @rest(
        type: "Patient"
        path: $pPath
        endpoint: "predict"
      ) {
        results
      }
  }
`;



var request = new XMLHttpRequest();
request.open("GET", "http://127.0.0.1:8000/predict_mlii_signals/?format=json&signal_record_name=103&lead=mlii&start=0&end=1800");
request.send();
request.onload = function () {
  var data = JSON.parse(request.response);
  console.log(data[0.5]);
}

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

  const [query, setQuery] = useState("");
  const [patient_number, setPatient_number] = useState(0);
  const [queryPath, setQueryPath] = useState("/?format=json&signal_record_name=103");
  const [predictionPath, setPredictionPath] = useState("/?format=json&signal_record_name=103&lead=mlii&start=0&end=10")
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);

  const [mlData, setMlData] = useState(0);
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const [loadGraphs, { called: calledSig, loading: graphLoading, error: graphError, data: sigData , fetchMore }] = useLazyQuery(signalQuery, {
    variables: { qPath: queryPath },
  });

  const [loadPredictions, { called: calledPred, loading: predictLoading, error: predictError, data: predictData }] = useLazyQuery(predictQuery, {
    variables: { pPath: predictionPath },
  });

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
  };

  const handlePatientSelect = (event) => {
    setPatient_number(event.target.value)
  }

  const handlePatientSubmit = () => {
    loadGraphs()
  }


  //did mount or updated




  //const [next, setNext] = useState(0);

  // handleStartChange => (event) => {
  //     setStart(event.value)
  // }
  // handleEndChange => (event) => {
  //   setStart(event.value)
  

  if (!calledSig) {


    return (
      <div >
        <Select
          placeholder="Choose Patient Record"
          onChange={handlePatientSelect}
          autoWidth
        >
          <MenuItem value={103}>103</MenuItem>
          <MenuItem value={205}>205</MenuItem>
        </Select>
        <button onClick={() => handlePatientSubmit()}>Submit</button>
      </div>
    );
  }
  else if(calledSig && graphLoading) {
    return <div>Loading...</div>
  }
  else {

    //setNext(signals.next); 
    let signals = updateGraph(sigData);
    const hasNextPage = sigData.patient.next;

    return (
      <div>
      <div >
      <Select
        placeholder="Choose Patient Record"
        onChange={handlePatientSelect}
        autoWidth
      >
        <MenuItem value={103}>103</MenuItem>
        <MenuItem value={205}>205</MenuItem>
      </Select>
      <button onClick={() => handlePatientSubmit()}>Submit</button>
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
                      qPath: (sigData.patient.previous).slice(29),
                    },
                    updateQuery: (prevResult, { fetchMoreResult }) => {
                      return fetchMoreResult
                    },
                  });
                }
                }
              >
                Load Previous
              </Button>
            )}
            {sigData.patient.next && (
              <Button
                onClick={() => {
                  fetchMore({
                    variables: {
                      qPath: (sigData.patient.next).slice(29),
                    },
                    updateQuery: (prevResult, { fetchMoreResult }) => {
                      return fetchMoreResult
                    },
                  });
                }
                }
              >
                Load Next
              </Button>
            )}

            <Divider />
            <Paper>
              <Title>V5</Title>
              <Chart2
                key={2}
                data={signals.v5}
              />
            </Paper>
          </Grid>
        </Grid>
        <PatientTable></PatientTable>

        <Box pt={4}></Box>
      </Container>
      </div>
    );
  }
}

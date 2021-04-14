import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
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

// Generate pairs of timestamps and readings
function createData(time, amount) {
  //return { time, amount };
  return { x: time, y: amount };
}

function createAnnotation(time, label) {
  return { value: time, label: label };
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
  // TODO: Make selection for Patient prettier
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
    "/?format=json&signal_record_name="
  );
  const [patientListPath, setPatientListPath] = useState("/?format=json");
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);

  // Styling
  const [mlData, setMlData] = useState(0);
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  // State that handles queries for signals
  // TODO: Make it dynamic responsive from the user
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
    ML2loadPredictions,
    {
      called: ML2calledPred,
      loading: ML2predictLoading,
      error: ML2predictError,
      data: ML2predictData,
    },
  ] = useLazyQuery(predictQuery, {
    variables: { pPath: predictionPath.concat(String(displayPatientNumber)).concat("&lead=mlii&start=0&end=1805") },
  });

  // State that handles queries for predictions on annotations from ML backend
  const [
    V5loadPredictions,
    {
      called: V5calledPred,
      loading: V5predictLoading,
      error: V5predictError,
      data: V5predictData,
    },
  ] = useLazyQuery(predictQuery, {
    variables: { pPath: predictionPath.concat(String(displayPatientNumber)).concat("&lead=v5&start=0&end=1805") },
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
    let MLIIdatapoints = [];
    let V5datapoints = [];
    let i = 0;
    //setStart(signals[0].time);
    //setEnd(Math.ceil(signals[signals.length - 1].time));

    for (i; i < signals.length; i++) {
      MLIIdatapoints.push(createData(signals[i].time, signals[i].mlii));
      V5datapoints.push(createData(signals[i].time, signals[i].v5));
    }
    return { ml2: MLIIdatapoints, v5: V5datapoints };
  }

  function updatePredictions(sigData) {
    let signals = sigData.patient.results;
    if (start == 0 && end == 0) {
      start = signals[0].time;
      let end = Math.ceil(signals[signals.length - 1].time);
    }
    let MLIIannotations = [];
    let V5annotations = [];
    let i = 0.5;

    for (i; i < (end - start); i++) {
      MLIIannotations.push(createData(signals[(i * 360)].time, signals[(i * 360)].mlii));
      V5annotations.push(createData(signals[(i * 360)].time, signals[(i * 360)].v5));
    }
    return { ml2: MLIIannotations, v5: V5annotations };
  }

  function updateAnnotations(sigData, ML2predictions, V5predictions) {
    let signals = sigData.patient.results;
    if(!start && !end) {
      setStart(signals[0].time);
      setEnd(Math.ceil(signals[signals.length - 1].time));
    }
    
    let MLIIannotations = [];
    let V5annotations = [];
    let i = start + 0.5;
    console.log("start: " + start + " end: " + end);
    console.log(i);
    for (i; i < end; i++) {
      MLIIannotations.push(createAnnotation(i, ML2predictions.predict.results[i]));
      V5annotations.push(createAnnotation(i, V5predictions.predict.results[i]));
    }
    return { ml2: MLIIannotations , v5: V5annotations};
  }

  // Handler to set patient id
  const handleDisplayPatientSelect = (event) => {
    setDisplayPatientNumber(event.target.value);
  };

  // Handler to update graph once selection is made post-startup
  const handlePatientSelect = () => {
    setPatientNumber(displayPatientNumber);
    setDataPoint(updateGraph(sigData));
  };

  // Handler to draw/update graph pre-startup
  const handlePatientSubmit = (displayPatientNumber) => {
    if (displayPatientNumber !== 0) {
      setPatientNumber(displayPatientNumber);
      loadGraphs();
      ML2loadPredictions();
      V5loadPredictions();
    }
  };

  const handleAnnotationSliceStart = (event) => {
    event.preventDefault();
  };

  const startChangeHandler = (event) => {
    let start = event.target.value;
    setStart(parseInt(start,10));
  };

  const endChangeHandler = (event) => {
    let end = event.target.value;
    setEnd(parseInt(end,10));
  };

  //did mount or updated

  //const [next, setNext] = useState(0);

  // handleStartChange => (event) => {
  //     setStart(event.value)
  // }
  // handleEndChange => (event) => {
  //   setStart(event.value)

  // Render Display Component
  if (!calledSig) {
    // Startup, select patient
    if (!calledPatients) {
      getPatientList();
      return <div>Loading...</div>;
    } else if (loadingPatients) {
      // Waiting for patient list
      return <div>Loading...</div>;
    } else {
      // Render selection list for pre-startup
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
            Select patient
          </button>
        </div>
      );
    }
  } else if (calledSig && (graphLoading || ML2predictLoading || V5predictLoading)) {
    // Loading graph and signals
    return <div>Loading...</div>;
  } else {
    // Query made, render graph

    // TODO: BUG IS HERE, need to optimize this function call/update
    let signals = updateGraph(sigData);
    let annotations = updateAnnotations(sigData, ML2predictData, V5predictData);

    /* Processing patient data */
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
    // Get comments about the patient
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
            style={{paddingright:5}}
          >
            {patientLists.patients.results.map((patient) => (
              <MenuItem value={patient.record_name}>
                {patient.record_name}
              </MenuItem>
            ))}
          </Select> 
          <button onClick={() => handlePatientSelect()}>Select patient</button>
        </div>
        <br/>
        <form style={{}} onSubmit={handleAnnotationSliceStart} >
        <p>Range to generate annotations between</p>
          <label>Start:</label>
            <input 
              type="text"
              name='startTime'
              style={{width:60}}
              onBlur={startChangeHandler}
            />
          <label>End:</label>
            <input
              type="text"
              name='endTime'
              style={{width:60}}
              onBlur={endChangeHandler}
            />
            <br/>
            <input type='submit' style={{margin:10}}/>
        </form>
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
                  annotations={annotations.ml2}
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
                    //predictions = updatePredictions(sigData);
                    annotations = updateAnnotations(sigData, ML2predictData, V5predictData);
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
                    //predictions = updatePredictions(sigData);
                    annotations = updateAnnotations(sigData, ML2predictData, V5predictData);
                  }}
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
                  annotations={annotations.v5}
                  />
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

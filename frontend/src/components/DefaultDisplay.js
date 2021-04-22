import React, { useState } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import PatientTable from "./Patient";
import { useLazyQuery } from "@apollo/client";
import Chart from "./Chart";
import { Button, MenuItem, Select } from "@material-ui/core";
import {
  signalQuery,
  predictQuery,
  patientQuery,
} from "../graphql-logic/queries";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

// Generate pairs of timestamps and readings
function createData(time, amount) {
  //return { time, amount };
  return { x: time, y: amount };
}

function createPredictAnnotation(time, label) {
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

  // Data State
  const [dataPoint, setDataPoint] = useState({});
  const [predictedAnnotationML2, setPredictedAnnotationML2] = useState({});
  const [predictedAnnotationV5, setPredictedAnnotationV5] = useState({});
  const [maxSignal, setMaxSignal] = useState(0);
  const [minSignal, setMinSignal] = useState(0);

  // Selection states
  const [displayPatientNumber, setDisplayPatientNumber] = useState("");
  const [patientNumber, setPatientNumber] = useState("");

  // States to handle request string
  const [query, setQuery] = useState("");
  const [queryPath, setQueryPath] = useState(
    "/?format=json&signal_record_name="
  );
  const [predictionPath, setPredictionPath] = useState(
    "/?format=json&signal_record_name="
  );
  const [patientListPath, setPatientListPath] = useState("/?format=json");
  const [start, setStart] = useState("0");
  const [end, setEnd] = useState("60");
  const [jumpStart, setJumpStart] = useState("0");
  const [jumpEnd, setJumpEnd] = useState("60");

  // Styling
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
    variables: {
      qPath: queryPath.concat(
        String(patientNumber)
          .concat("&start=")
          .concat(start)
          .concat("&end=")
          .concat(end)
      ),
    },
    onCompleted: (sigData) => setDataPoint(updateGraph(sigData)),
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
    variables: {
      pPath: queryPath.concat(
        String(patientNumber)
          .concat("&start=")
          .concat(start)
          .concat("&end=")
          .concat(end)
          .concat("&lead=mlii")
      ),
    },
    onCompleted: (ML2predictData) =>
      setPredictedAnnotationML2(updatePredictAnnotationsML2(ML2predictData)),
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
    variables: {
      pPath: queryPath.concat(
        String(patientNumber)
          .concat("&start=")
          .concat(start)
          .concat("&end=")
          .concat(end)
          .concat("&lead=v5")
      ),
    },
    onCompleted: (V5predictData) =>
      setPredictedAnnotationV5(updatePredictAnnotationsV5(V5predictData)),
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
    let mliiFoundAnnotations = [];
    let v5FoundAnnotations = [];
    let i = 0;
    let MLIImaximum = 0;
    let MLIIminimum = 1000000000000000;
    let maximum = 0;
    let minimum = 1000000000000000;

    for (i; i < signals.length; i++) {
      MLIIdatapoints.push(createData(signals[i].time, signals[i].mlii));
      V5datapoints.push(createData(signals[i].time, signals[i].v5));
      // DB for annotation may be either null (older version) or '' (newer version)
      if (signals[i].annotation !== null && signals[i].annotation !== "") {
        mliiFoundAnnotations.push({
          x: signals[i].time,
          y: signals[i].mlii,
          label: signals[i].annotation,
        });
        v5FoundAnnotations.push({
          x: signals[i].time,
          y: signals[i].v5,
          label: signals[i].annotation,
        });
      }
      MLIImaximum =
        MLIImaximum < signals[i].mlii ? signals[i].mlii : MLIImaximum;
      MLIIminimum =
        MLIIminimum > signals[i].mlii ? signals[i].mlii : MLIIminimum;
      maximum = maximum < signals[i].v5 ? signals[i].v5 : maximum;
      minimum = minimum > signals[i].v5 ? signals[i].v5 : minimum;
    }
    return {
      ml2: MLIIdatapoints,
      v5: V5datapoints,
      ml2Annotations: mliiFoundAnnotations,
      v5Annotations: v5FoundAnnotations,
      ml2max: MLIImaximum,
      ml2min: MLIIminimum,
      max: maximum,
      min: minimum,
    };
  }

  function updatePredictAnnotationsML2(ML2predictions) {
    let startTime = parseInt(start);
    let endTime = parseInt(end);

    let MLIIPredictions = [];
    let i = startTime + 0.5;
    for (i; i < endTime; i++) {
      MLIIPredictions.push(
        createPredictAnnotation(i, ML2predictions.predict.results[i])
      );
    }
    return { ml2: MLIIPredictions };
  }

  function updatePredictAnnotationsV5(V5predictions) {
    let startTime = parseInt(start);
    let endTime = parseInt(end);

    let V5Predictions = [];
    let i = startTime + 0.5;
    for (i; i < endTime; i++) {
      V5Predictions.push(
        createPredictAnnotation(i, V5predictions.predict.results[i])
      );
    }
    return { v5: V5Predictions };
  }

  // Handler to set patient id
  const handleDisplayPatientSelect = (event) => {
    event.preventDefault();
    setDisplayPatientNumber(event.target.value);
  };

  // Handler to update graph once selection is made post-startup
  const handlePatientSelect = (event) => {
    setPatientNumber(displayPatientNumber);
    setDataPoint({});
    loadGraphs();
  };

  // Handler to draw/update graph pre-startup
  const handlePatientSubmit = (displayPatientNumber) => {
    if (displayPatientNumber !== "") {
      setPatientNumber(displayPatientNumber);
      setDataPoint({});
      loadGraphs();
      ML2loadPredictions();
      V5loadPredictions();
    }
  };

  const handleAnnotationSliceStart = (event) => {
    setStart(jumpStart);
    setEnd(jumpEnd);
    loadGraphs();
    ML2loadPredictions();
    V5loadPredictions();
  };

  const startChangeHandler = (event) => {
    event.preventDefault();
    setJumpStart(event.target.value);
  };

  const endChangeHandler = (event) => {
    event.preventDefault();
    setJumpEnd(event.target.value);
  };

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
          <p>Select Patient:</p>
          <Select
            placeholder="Choose Patient Record"
            onChange={handleDisplayPatientSelect}
            value={displayPatientNumber}
            displayEmpty
            autoWidth
          >
            {patientLists.patients.results.map((patient) => (
              <MenuItem value={patient.record_name} key={patient.record_name}>
                {patient.record_name}
              </MenuItem>
            ))}
          </Select>
          <button onClick={() => handlePatientSubmit(displayPatientNumber)}>
            Select Patient
          </button>
        </div>
      );
    }
  } else if (graphLoading || ML2predictLoading || V5predictLoading) {
    // Loading graph and signals
    return <div>Loading...</div>;
  } else if (
    dataPoint &&
    Object.keys(dataPoint).length === 0 &&
    dataPoint.constructor === Object
  ) {
    // Save all signal data points
    setDataPoint({ ...updateGraph(sigData) });
  } else {
    // Query made, render graph

    let signals = dataPoint;
    let predictionsML2 = predictedAnnotationML2;
    let predictionsV5 = predictedAnnotationV5;

    // let predictions = predictedAnnotation;

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
          <p>Select Patient:</p>
          <Select
            placeholder="Choose Patient Record"
            onChange={handleDisplayPatientSelect}
            value={displayPatientNumber}
            autoWidth
            style={{ paddingright: 5 }}
          >
            {patientLists.patients.results.map((patient) => (
              <MenuItem value={patient.record_name} key={patient.record_name}>
                {patient.record_name}
              </MenuItem>
            ))}
          </Select>
          <button onClick={() => handlePatientSelect()}>Select Patient</button>
        </div>
        <br />
        <form style={{}}>
          <p>Get time slice of data and ML annotations</p>
          <label>Start: </label>
          <input
            type="text"
            name="startTime"
            style={{ width: 60 }}
            onChange={startChangeHandler}
          />
          <label>End: </label>
          <input
            type="text"
            name="endTime"
            style={{ width: 60 }}
            onChange={endChangeHandler}
          />
          <button onClick={(e) => handleAnnotationSliceStart(e)}>
            Select Slice
          </button>
        </form>
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            {/* Chart */}
            <Grid item xs={12} md={10} lg={12}>
              <Paper>
                <Typography variant="h4">ML II</Typography>
                {/* <form onSubmit={handleJumpSubmit}>
              
              <input label="Start" onChange={setStart(this.value)}></input>
              <
            </form> */}
                <Chart
                  key={1}
                  data={signals.ml2}
                  predictions={predictionsML2.ml2}
                  annotations={signals.ml2Annotations}
                  max={signals.ml2max}
                  min={signals.ml2min}
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
                        setDataPoint({ ...updateGraph(fetchMoreResult) });
                        return fetchMoreResult;
                      },
                    });
                    predictionsML2 = updatePredictAnnotationsML2(
                      ML2predictData
                    );
                    predictionsV5 = updatePredictAnnotationsV5(V5predictData);
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
                        setDataPoint({ ...updateGraph(fetchMoreResult) });
                        return fetchMoreResult;
                      },
                    });
                    predictionsML2 = updatePredictAnnotationsML2(
                      ML2predictData
                    );
                    predictionsV5 = updatePredictAnnotationsV5(V5predictData);
                  }}
                >
                  Load Next
                </Button>
              )}

              <Divider />
              <Paper>
                <Typography variant="h4">V5</Typography>
                <Chart
                  key={2}
                  data={signals.v5}
                  predictions={predictionsV5.v5}
                  annotations={signals.v5Annotations}
                  max={signals.max}
                  min={signals.min}
                />
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2} direction="column">
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

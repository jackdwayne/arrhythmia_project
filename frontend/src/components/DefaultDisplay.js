import React, { useState } from "react";
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
import { useQuery } from "@apollo/client";
//import { signalQuery } from "../graphql-logic/queries";
import { gql } from "@apollo/client";
import Chart2 from "./Chart2";

var patient_number = 100;
var start_time = 0;
var end_time = 10000;

const signalQuery = gql`
  query getPatient {
    patient
      @rest(
        type: "Patient"
        path: "/?format=json&signal_record_name_id=${patient_number}&timeRange=${start_time},${end_time}"
        endpoint: "signal"
      ) {
      count
      next
      previous
      results
    }
  }
`;

let beats = [0.214, 1.028, 1.844, 2.631, 3.419, 4.206, 5.025];
let annotations = ["N", "N", "N", "N", "N", "N", "N"];
// Generate pairs of timestamps and readings
function createData(time, amount) {
  //return { time, amount };
  return {x: time, y: amount};
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

function updateGraph(data) {
  let signals = data.patient.results;
  // Here is how to get the next page
  let next = data.patient.next;
  // this will display in the console tab on the browser
  console.log(next);
  let MLIIdatapoints = [];
  let V5datapoints = [];
  let i = 0;

  for (i; i < signals.length; i++) {
    MLIIdatapoints.push(createData(signals[i].time, signals[i].mlii));
    V5datapoints.push(createData(signals[i].time, signals[i].v5));
  }
  return { ml2: MLIIdatapoints, v5: V5datapoints };
}


export default function Sample() {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const { loading, error, data } = useQuery(signalQuery);
  const [dataset, setDataset] = useState(0);

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;
  let signals = updateGraph(data) 

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Grid container spacing={3}>
        {/* Chart */}
        <Grid item xs={12} md={10} lg={12}>
          <Paper>
            <Title>ML II</Title>
            <Chart2
              key={1}
              data={signals.ml2}
              //annotations={annotations}
            />
          </Paper>
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
  );
}

import React from "react";
import Title from "./Title";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

export default function PatientTable(props) {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Patient Record No.</TableCell>
            <TableCell align="right">Age</TableCell>
            <TableCell align="right">Gender</TableCell>
            <TableCell align="right">Number Signal Data Points</TableCell>
            <TableCell align="right">Record Types</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow key={props.patientID}>
            <TableCell component="th" scope="row">
              {props.patientID}
            </TableCell>

            {/* MIT database might not record age, saved as -1 in db*/}
            <TableCell align="right">
              {props.patient[0] === "-1"
                ? "Age Not Recorded"
                : props.patient[0]}
            </TableCell>
            {
            /* Database identify gender from comment with M being Male, 
             * F = female. MIT DB definitely identifies gender
             */
            }
            <TableCell align="right">
              {props.patient[1] === "M" ? "Male" : "Female"}
            </TableCell>
            <TableCell align="right">{props.patient[2]}</TableCell>
            <TableCell align="right">{props.patient[3]}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

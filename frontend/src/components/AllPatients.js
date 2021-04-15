import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { useLazyQuery } from "@apollo/client";
import { patientQuery } from "../graphql-logic/queries";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function createData(patientNumber, age, gender, time, annotations) {
  return { patientNumber, age, gender, time, annotations };
}

export default function PatientTable() {
  // States used to request patients
  const [
    getPatientList,
    {
      called: calledPatients,
      loading: loadingPatients,
      data: patientLists,
      fetchMore: fetchMorePatients,
    },
  ] = useLazyQuery(patientQuery, { variables: { pPath: "/?format=json" } });

  const classes = useStyles();

  // TODO: Implement pagination button to iterate through lists of patient
  //       Current MIT Database did not have enough patients needed to hit
  //       pagination limit. Live data may have enough patients, so just in case
  if (!calledPatients) {
    getPatientList();
    return <div>Loading...</div>;
  } else if (loadingPatients) {
    return <div>Loading...</div>;
  } else {
    const results = patientLists.patients.results;
    return (
      <TableContainer component={Paper}>
        <Table
          className={classes.table}
          size="small"
          aria-label="a dense table"
        >
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
            {results.map((patient) => (
              <TableRow key={patient.name}>
                <TableCell component="th" scope="row">
                  {patient.record_name}
                </TableCell>
                {/* MIT database might not record age, saved as -1 in db*/}
                <TableCell align="right">
                  {patient.comments
                    .replace(/^\s+|\s+$|'|\[|\]/g, "")
                    .split(" ")[0] === "-1"
                    ? "Age Not Recorded"
                    : patient.comments
                        .replace(/^\s+|\s+$|'|\[|\]/g, "")
                        .split(" ")[0]}
                </TableCell>
                {
                /* Database identify gender from comment with M being Male, 
                 * F = female. MIT DB definitely identifies gender
                 */
                }
                <TableCell align="right">
                  {patient.comments
                    .replace(/^\s+|\s+$|'|\[|\]/g, "")
                    .split(" ")[1] === "M"
                    ? "Male"
                    : "Female"}
                </TableCell>
                <TableCell align="right">{patient.sig_len}</TableCell>
                <TableCell align="right">
                  {patient.sig_name.replace(/\[|\]|'/g, "")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}

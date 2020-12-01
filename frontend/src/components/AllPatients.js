import React from 'react';
import Title from './Title';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function createData(patientNumber, age, gender, time, annotations) {
  return { patientNumber, age, gender, time, annotations };
}

const rows = [
  createData('100', '69', 'Male', '30:06', '2273'),
  createData('101', '75', 'Female', '30:05', '1874'),
  createData('102', '84', 'Female', '30:05', '2192'),
  createData('103', 'n/a', 'Male', '30:05', '2091'),
  createData('104', '66', 'Female', '30:05', '2311')
];

export default function PatientTable() {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Patient Record No.</TableCell>
            <TableCell align="right">Age</TableCell>
            <TableCell align="right">Gender</TableCell>
            <TableCell align="right">Record Length</TableCell>
            <TableCell align="right">Total Annotations</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.patientNumber}
              </TableCell>
              <TableCell align="right">{row.age}</TableCell>
              <TableCell align="right">{row.gender}</TableCell>
              <TableCell align="right">{row.time}</TableCell>
              <TableCell align="right">{row.annotations}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
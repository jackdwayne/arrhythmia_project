import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Chart from './Chart';
import PatientTable from './Patient';
import {UserInfo, CreateUser} from './Users';
import Title from './Title';

// Generate pairs of timestamps and readings
function createData(time, amount) {
  return { time, amount };
}

const drawerWidth = 240;
const beats = ["00:09", "00:28", "00:47", "00:66"];
const annotations = ['N', 'N', 'B', 'N'];
const MLIIdatapoints = [createData('00:00', -0.145),
      createData('00:01', -0.147),
      createData('00:02', -0.146),
      createData('00:03', -0.143),
      createData('00:04', -0.147),
      createData('00:05', -0.143),
      createData('00:06', -0.145),
      createData('00:07', -0.145),
      createData('00:08', -0.165),
      createData('00:09', -0.115),
      createData('00:10', -0.175),
      createData('00:11', -0.145),
      createData('00:12', -0.147),
      createData('00:13', -0.146),
      createData('00:14', -0.143),
      createData('00:15', -0.147),
      createData('00:16', -0.143),
      createData('00:17', -0.145),
      createData('00:18', -0.145),
      createData('00:19', -0.145),
      createData('00:20', -0.147),
      createData('00:21', -0.146),
      createData('00:22', -0.143),
      createData('00:23', -0.147),
      createData('00:24', -0.143),
      createData('00:25', -0.145),
      createData('00:26', -0.145),
      createData('00:27', -0.165),
      createData('00:28', -0.115),
      createData('00:29', -0.175),
      createData('00:30', -0.145),
      createData('00:31', -0.147),
      createData('00:32', -0.146),
      createData('00:33', -0.143),
      createData('00:34', -0.147),
      createData('00:35', -0.143),
      createData('00:36', -0.145),
      createData('00:37', -0.145),
      createData('00:38', -0.145),
      createData('00:39', -0.147),
      createData('00:40', -0.146),
      createData('00:41', -0.143),
      createData('00:42', -0.147),
      createData('00:43', -0.143),
      createData('00:44', -0.145),
      createData('00:45', -0.145),
      createData('00:46', -0.165),
      createData('00:47', -0.115),
      createData('00:48', -0.175),
      createData('00:49', -0.145),
      createData('00:50', -0.147),
      createData('00:51', -0.146),
      createData('00:52', -0.143),
      createData('00:53', -0.147),
      createData('00:54', -0.143),
      createData('00:55', -0.145),
      createData('00:56', -0.145),
      createData('00:57', -0.145),
      createData('00:58', -0.147),
      createData('00:59', -0.146),
      createData('00:60', -0.143),
      createData('00:61', -0.147),
      createData('00:62', -0.143),
      createData('00:63', -0.145),
      createData('00:64', -0.145),
      createData('00:65', -0.165),
      createData('00:66', -0.115),
      createData('00:67', -0.175),
      createData('00:68', -0.145),
      createData('00:69', -0.147),
      createData('00:70', -0.146),
      createData('00:71', -0.143),
      createData('00:72', -0.147),
      createData('00:73', -0.143),
      createData('00:74', -0.145),
      createData('00:75', -0.145)];
const V1datapoints = [createData('00:00', -0.145),
      createData('00:01', -0.136),
      createData('00:02', -0.140),
      createData('00:03', -0.137),
      createData('00:04', -0.143),
      createData('00:05', -0.143),
      createData('00:06', -0.145),
      createData('00:07', -0.140),
      createData('00:08', -0.135),
      createData('00:09', -0.091),
      createData('00:10', -0.145),
      createData('00:11', -0.135),
      createData('00:12', -0.147),
      createData('00:13', -0.136),
      createData('00:14', -0.140),
      createData('00:15', -0.141),
      createData('00:16', -0.139),
      createData('00:17', -0.139),
      createData('00:18', -0.139),
      createData('00:19', -0.140),
      createData('00:20', -0.143),
      createData('00:21', -0.139),
      createData('00:22', -0.143),
      createData('00:23', -0.135),
      createData('00:24', -0.140),
      createData('00:25', -0.147),
      createData('00:26', -0.150),
      createData('00:27', -0.170),
      createData('00:28', -0.110),
      createData('00:29', -0.168),
      createData('00:30', -0.138),
      createData('00:31', -0.137),
      createData('00:32', -0.146),
      createData('00:33', -0.143),
      createData('00:34', -0.147),
      createData('00:35', -0.143),
      createData('00:36', -0.142),
      createData('00:37', -0.145),
      createData('00:38', -0.135),
      createData('00:39', -0.147),
      createData('00:40', -0.146),
      createData('00:41', -0.143),
      createData('00:42', -0.147),
      createData('00:43', -0.133),
      createData('00:44', -0.134),
      createData('00:45', -0.135),
      createData('00:46', -0.165),
      createData('00:47', -0.125),
      createData('00:48', -0.165),
      createData('00:49', -0.145),
      createData('00:50', -0.147),
      createData('00:51', -0.146),
      createData('00:52', -0.143),
      createData('00:53', -0.147),
      createData('00:54', -0.143),
      createData('00:55', -0.145),
      createData('00:56', -0.145),
      createData('00:57', -0.145),
      createData('00:58', -0.147),
      createData('00:59', -0.146),
      createData('00:60', -0.143),
      createData('00:61', -0.147),
      createData('00:62', -0.143),
      createData('00:63', -0.145),
      createData('00:64', -0.145),
      createData('00:65', -0.165),
      createData('00:66', -0.115),
      createData('00:67', -0.175),
      createData('00:68', -0.145),
      createData('00:69', -0.147),
      createData('00:70', -0.146),
      createData('00:71', -0.143),
      createData('00:72', -0.147),
      createData('00:73', -0.143),
      createData('00:74', -0.145),
      createData('00:75', -0.145)];
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
}));

export default function Sample() {
	const classes = useStyles();
	const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

	return (
		<Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            {/* Chart */}
            <Grid item xs={12} md={10} lg={12}>
              <Paper className={fixedHeightPaper}>
                <Title>ML II</Title>
                <Chart data={MLIIdatapoints} beats={beats} annotations={annotations}/>
              </Paper>
              <Divider />
              <Paper className={fixedHeightPaper}>
                <Title>V1</Title>
                <Chart data={V1datapoints} beats={beats} annotations={annotations}/>
              </Paper>
            </Grid>
          </Grid>
          <PatientTable>
          </PatientTable>
          <CreateUser/>
          <UserInfo/>
          <Box pt={4}>
            
          </Box>
        </Container>
        );
}
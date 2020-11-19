import React, { useState } from 'react';
import { useTheme } from '@material-ui/core/styles';
import { LineChart, Brush, Line, XAxis, YAxis, Label, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';


// Generate Sales Data
function createData(time, amount) {
  return { time, amount };
}

const data = [
  createData('00:00', -0.145),
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
  createData('00:75', -0.145),
];
const heartbeats = ["00:09", "00:28", "00:47", "00:66"];
const annotations = ['N', 'N', 'B', 'N'];

function createAnnotations() {

  const items = [];

  for(let i = 0; i < heartbeats.length; i++) {
    items.push(<ReferenceLine x={heartbeats[i]} stroke="green" label={annotations[i]} />);
  }

   return (
    <div>
      {items}
    </div>
    )
}

export default function Chart() {
  const theme = useTheme();

  return (
    <React.Fragment>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          {createAnnotations().props.children}
          <XAxis dataKey="time" stroke={theme.palette.text.secondary} />
          <YAxis stroke={theme.palette.text.secondary}>
            <Label
              angle={270}
              position="left"
              style={{ textAnchor: 'middle', fill: theme.palette.text.primary }}
            >
              milliVolt (mV)
            </Label>
          </YAxis>
          <Line type="monotone" dataKey="amount" stroke={theme.palette.primary.main} dot={false} />
          <Brush dataKey='time' height={15} stroke="#8884d8"/>
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
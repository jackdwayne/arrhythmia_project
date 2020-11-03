import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer, CartesianGrid } from 'recharts';
import Title from './Title';

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
];

export default function Chart() {
  const theme = useTheme();

  return (
    <React.Fragment>
      <Title>ECG</Title>
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
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
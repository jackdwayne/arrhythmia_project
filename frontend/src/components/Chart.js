import React, { Component} from 'react';

import { LineChart, Brush, Line, XAxis, YAxis, Label, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';

function createAnnotations(beats, annotations) {
  const items = [];
  for(let i = 0; i < beats.length; i++) {
    items.push(<ReferenceLine x={beats[i]} stroke="green" label={annotations[i]} />);
  }
   return (
    <div>
      {items}
    </div>
    )
}

export default class Chart extends Component{

  render(){
    
    return (
      <React.Fragment>
        <ResponsiveContainer>
          <LineChart
            data={this.props.data}
            margin={{
              top: 16,
              right: 16,
              bottom: 0,
              left: 24,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            {createAnnotations(this.props.beats, this.props.annotations).props.children}
            <XAxis dataKey="time" stroke={"blue"} />
            <YAxis stroke={"green"}>
              <Label
                angle={270}
                position="left"
                style={{ textAnchor: 'middle', fill: "blue" }}
              >
                milliVolt (mV)
              </Label>
            </YAxis>
            <Line type="monotone" dataKey="amount" stroke={"green"} dot={false} />
            <Brush dataKey='time' height={15} stroke="#8884d8"/>
          </LineChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  }
}
  

  

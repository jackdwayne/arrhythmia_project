/* App.js */
import React, { Component } from "react";
import CanvasJSReact from "./canvasjs.stock.react";
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSStockChart = CanvasJSReact.CanvasJSStockChart;

class Chart2 extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const options = {
      animationEnabled: true,
      exportEnabled: true,
      charts: [
        {
          axisX: {
            crosshair: {
              enabled: true,
              snapToDataPoint: true,
            },
          },
          axisY: {
            minimum: -1,
            maximum: 2.0,
            interval: 0.25,
            crosshair: {
              enabled: true,
              //snapToDataPoint: true
            },
          },
          data: [
            {
              type: "spline",
              dataPoints: this.props.data,
            },
            {
              type: "line",
              dataPoints: [],
            },
          ],
        },
      ],
      rangeSelector: {
        inputFields: {
          startValue: this.props.data[0].time,
          endValue: this.props.data[10].time,
          valueFormatString: "###0",
        },

        buttons: [
          {
            label: "5",
            range: 5,
            rangeType: "number",
          },
          {
            label: "10",
            range: 10,
            rangeType: "number",
          },
          {
            label: "20",
            range: 20,
            rangeType: "number",
          },
          {
            label: "All",
            rangeType: "all",
          },
        ],
      },
    };
    const containerProps = {
      width: "100%",
      height: "450px",
      margin: "auto",
    };
    return (
      <div>
        <div>
          <CanvasJSStockChart
            containerProps={containerProps}
            options={options}
            /* onRef = {ref => this.chart = ref} */
          />
        </div>
      </div>
    );
  }
}

export default Chart2;

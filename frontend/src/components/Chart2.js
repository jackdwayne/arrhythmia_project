/* App.js */
import React, { PureComponent } from "react";
import CanvasJSReact from "./canvasjs.stock.react";
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSStockChart = CanvasJSReact.CanvasJSStockChart;

class Chart2 extends PureComponent {
  render() {
    const options = {
      animationEnabled: true,
      exportEnabled: true,
      charts: [
        {
          axisX: {
            title: "Time (s)",
            crosshair: {
              enabled: true,
              snapToDataPoint: true,
            },
            stripLines: this.props.predictions,
          },
          axisY: {
            title: "Measurement (hz)",
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
              type: "scatter",
              markerSize: 8,
              toolTipContent: "{x} s: {y} hz, Annotation: {label}",
              dataPoints: this.props.annotations,
              color: "green",
            },
            {
              type: "scatter",
              dataPoints: this.props.predictData,
              // Doesn't actually work :(
              indexLabelOrientation: "horizontal",
            },
            {
              type: "spline",
              toolTipContent: "{x} s: {y} hz",
              dataPoints: this.props.data,
              color: "#4F81BC",
            },
          ],
        },
      ],
      rangeSelector: {
        inputFields: {
          startValue: this.props.data[0].time,
          endValue: this.props.data[1800].time,
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

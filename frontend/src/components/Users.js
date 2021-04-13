import React from "react";
import { Component, ProgressBar } from "react";
import axios from "axios"
import { blue } from "@material-ui/core/colors";

export class AddUser extends Component {
  constructor(props, context) {
    super(props);
    this.fileInputButton = this.fileInputButton.bind(this);
    this.fileInputHandler = this.fileInputHandler.bind(this);
  }

  state = {
    selectedFiles: null,
  };

  componentDidMount = () => {
    const { selectedFiles } = this.props;
    this.setState({ selectedFiles });
  };

  fileInputHandler(event) {
    const files = event.target.files;
    let tempArray = [];
    for (let i = 0; i < files.length; i++) {
      //formData.append(`images[${i}]`, files[i])
      //console.log(event.target.files[i])
      tempArray[i] = event.target.files[i];
    }

    this.setState({
      //this.selectedFiles.concat(event.target.files[i])
      selectedFiles: tempArray,
    });
  }

  fileInputButton(event) {
    let currentFiles = this.state.selectedFiles;
    let formData = new FormData();
    console.log("\nhere" + currentFiles + " current file shouold be before");
    for (let i = 0; i < currentFiles.length; i++) {
      console.log("i: " + i.toString());
      formData.append("file", currentFiles[i]);
      console.log(currentFiles[i]);
    }
    //formData.append('file', currentFiles);

    let url = "http://localhost:8000/uploadPatient/";

    axios
      .post(url, formData, {
        headers: {
          "content-type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => console.log("Response body", err));
  }
  render(){
    return(
     
      <div className="AddUser">
        
        <input  style={{ paddingTop:"0px", cursor:"pointer", border:"1px", width: "50%", background:"#add8e6", height:"250px", marginBottom:"400px"}} onChange={this.fileInputHandler} type="file" multiple="multiple" name="patientRecord"/>
        <button style={{ paddingTop:"0px", cursor:"pointer", border:"1px",  width: "50%", background:"#add8e6", height:"250px", marginBottom:"400px"}} onClick={this.fileInputButton}>Submit</button>

      </div>
    );
  }
}

import React from "react";
import { Component, ProgressBar } from "react";
import axios from "axios"
import { blue } from "@material-ui/core/colors";


export class AddUser extends Component{
  
  constructor(props, context){
    super(props)
    this.fileInputButton = this.fileInputButton.bind(this);
    this.fileInputHandler = this.fileInputHandler.bind(this);

  }

  state = {
    selectedFiles: null,
    progress: 0,
  }
  
  componentDidMount = () => {
    const {selectedFiles} = this.props;
    this.setState({ selectedFiles })
  }

  fileInputHandler(event){

    const files = event.target.files;
    let tempArray = []
    for (let i = 0; i < files.length; i++) {
        //formData.append(`images[${i}]`, files[i])
        //console.log(event.target.files[i])  
        tempArray[i] = event.target.files[i]
    }

    this.setState( {
      //this.selectedFiles.concat(event.target.files[i])
      selectedFiles: tempArray, 
      progress: Math.round((100 * event.loaded) / event.total),

    })  
  }

  fileInputButton(event, onUploadProgress) {
    let currentFiles = this.state.selectedFiles;
    if(currentFiles){
      let formData = new FormData();
      console.log("\nhere" + currentFiles + " current file shouold be before")
      for (let i = 0; i < currentFiles.length; i++) {
  
        console.log("i: " + i.toString())
        formData.append('file', currentFiles[i]);
        console.log(currentFiles[i])  
      }
      //formData.append('file', currentFiles);
      
      let url = 'http://localhost:8000/uploadPatient/'
      
      axios.post(url, formData, {
        headers: {
          'content-type': 'multipart/form-data'
        },
        onUploadProgress
      })
          .then(res => {
            console.log(res.data);
          })
          .catch(err => console.log('Response body', err))
    }
  }
  
  render(){
    return(
     
      <div className="AddUser" style={{align:"center", width:"75%",  margin:"0 auto", paddingBottom:"350px"}} >
        <h1 style={{paddingTop:"50px"}}>
        Upload Patient Data From MIT Database
        </h1>
        <h3 style={{paddingTop:"50px"}}>
        The MIT database can be located here: https://physionet.org/content/mitdb/1.0.0/
        </h3>
        <h4 style={{ lineHeight:"40px", width:"75%", paddingTop:"50px", margin:"0 auto", textAlign:"center"}}>
          Upload the 4 files for each patient. Specifically the files with the extensions .atr, .hea, .xws, .dat.

          For example, if you want to insert patient 100, upload the following 4 files: 

                        100.atr
                        100.hea
                        100.xws
                        100.dat

        </h4>
        <div style={{paddingTop:"100px", paddingBottom:"150px"}}>
          <input   style={{ width:"25%", margin:"0 auto"}} onChange={this.fileInputHandler} type="file" multiple="multiple" name="patientRecord"/>
          
          <button style={{width:"25%", margin:"0 auto", align:"center"}} onClick={this.fileInputButton}>Insert Into Database</button>
        </div>
       
      </div>
    );
  }
}


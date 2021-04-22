import React from "react";
import { Component, ProgressBar } from "react";
import axios from "axios"
import LinearProgress from '@material-ui/core/LinearProgress';

export class AddUser extends Component{
  
  constructor(props, context){
    super(props)
    this.fileInputButton = this.fileInputButton.bind(this);
    this.fileInputHandler = this.fileInputHandler.bind(this);
    this.checkLoading = this.checkLoading.bind(this);
  }

  state = {
    selectedFiles: null,
    loading: false,
    doneInserting: false,
    errorInserting: false,
  }
  
  componentDidMount = () => {
    const {selectedFiles, loading} = this.props;
    this.setState({ selectedFiles, loading })
  }

  fileInputHandler(event) {
    const files = event.target.files;
    let tempArray = [];
    for (let i = 0; i < files.length; i++) {
        tempArray[i] = event.target.files[i]
    }

    this.setState( {
      selectedFiles: tempArray, 
    })  
  }

  

  fileInputButton() {
    let currentFiles = this.state.selectedFiles;
    if (currentFiles) {
      let formData = new FormData();
      for (let i = 0; i < currentFiles.length; i++) {
        console.log("i: " + i.toString());
        formData.append("file", currentFiles[i]);
        console.log(currentFiles[i]);
      }
      
      let url = 'http://localhost:8000/uploadPatient/'

      this.setState( {
        loading: true, 
      })  

      axios.post(url, formData, {
        headers: {
          'content-type': 'multipart/form-data'
        },
      })  
          .then(res => {
            console.log(res.data);
            this.setState( {
              loading: false, 
              doneInserting: true,
              errorInserting: false,
              selectedFiles: null,
            })  
          })
          .catch(err => {
            console.log('Response body', err); 
            this.setState( {
              loading: false, 
              doneInserting: false,
              errorInserting: true,
              selectedFiles: null,
            })
          })
          
        }
  }

  checkLoading(){

    let isloading = this.state.loading;
    let isDoneInserting = this.state.doneInserting;
    let errorInsert = this.state.errorInserting;

    if(isloading === true){
      return (
        <div>
          <h2>Currently Inserting Data Into Database....</h2>
            <div>
              <LinearProgress style={{backgroundColor:"black"}}/>
              <LinearProgress style={{backgroundColor:"white"}} />
            </div>
        </div> 
      );
    }
    if(isDoneInserting === true){
      return <h2>Done Inserting Patient Data</h2>;
    }
    if(errorInsert === true){
      return <h2>Error Inserting Patient Data</h2>;
    }
    else{
      return <h2></h2>;
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
            <this.checkLoading isloading={true}/>
        </div>  
    );
  }
}

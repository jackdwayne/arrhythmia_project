import React from "react";
import { Component } from "react";
//import axios from "axios"


export class AddUser extends Component{
  
  constructor(props, context){
    super(props)
    this.fileInputButton = this.fileInputButton.bind(this);
    this.fileInputHandler = this.fileInputHandler.bind(this);

  }

  state = {
    selectedFile: null
  }
  
  componentDidMount = () => {
    const {selectedFile} = this.props;
    this.setState({ selectedFile })
  }

  fileInputHandler(event){
    console.log(event.target.files[0])
    this.setState({
      selectedFile: event.target.files[0]
    })
  }

  fileInputButton(event) {
    let currentFile = this.state.selectedFile;

  }
  
  render(){
    return(
      <div className="AddUser">
        <input onChange={this.fileInputHandler} type="file" name="patientRecord"/>
        <button onClick={this.fileInputButton}>Submit</button>
      </div>
    );
  }
}


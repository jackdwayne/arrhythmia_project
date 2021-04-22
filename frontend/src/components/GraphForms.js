import React, { Component } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
//import Chart from "./Chart";
import PatientTable from "./Patient";
import Title from "./Title";
import { useQuery, useLazyQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import Chart2 from "./Chart2";
import { Button, Input, MenuItem, Select } from "@material-ui/core";
import { patientQuery } from "../graphql-logic/queries";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";


export default class GraphForms extends Component {

    constructor(props) {
        super(props);
        this.state = {
            start: 0,
            end: 60,
            patientList: this.props.patientList,
            patient: 103

        };

        // bind handlers here
        this.handleSetStart = this.handleSetStart.bind(this);
        this.handleSetEnd = this.handleSetEnd.bind(this);
        this.handleJumpSubmit = this.handleJumpSubmit.bind(this);
        this.handlePatientSelect = this.handlePatientSelect.bind(this);
    }


    handleJumpSubmit = () => {
        this.props.setPatient(this.state.patient);
        this.props.setStart(this.state.start);
        this.props.setEnd(this.state.end);
        this.props.jumpSubmit()
    };

    handleSetStart = (event) => {
        this.setState({start: event.target.value})
    }

    handleSetEnd = (event) => {
        this.setState({end: event.target.value})
    }

    handlePatientSelect = (event) => {
        this.setState({patient: event.target.value})
    }


    render() {
        // constants go here

        return (
            <div>
                {/* Select button */}
                <form onSubmit={this.handleJumpSubmit()}>
                    <Select
                        placeholder="Choose Patient Record"
                        onChange={this.handlePatientSelect}
                        value={103}
                        autoWidth
                    >
                        {this.props.patients.patients.results.map((patient) => (
                            <MenuItem value={patient.record_name}>
                                {patient.record_name}
                            </MenuItem>
                        ))}
                    </Select>
                    <label>Start Time:</label>
                    <input onChange={this.handleSetStart}></input>
                    <label>End Time:</label>
                    <input onChange={this.handleSetStart}></input>
                    <input type="submit" value="Submit" />
                </form>
            </div>
        );
        
    }


}
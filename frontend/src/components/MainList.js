import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DashboardIcon from "@material-ui/icons/Dashboard";
import PeopleIcon from "@material-ui/icons/People";
import BarChartIcon from "@material-ui/icons/BarChart";

export default class MainList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selectedIndex: 0 };
    this.handleListItemClick = this.handleListItemClick.bind(this);
  }

  handleListItemClick(index) {
    this.props.listIndex(index);
    this.setState({ selectedIndex: index });
  }

  render() {
    const { selectedIndex } = this.state;

    return (
      <List>
        <ListItem
          button
          selected={selectedIndex === 0}
          onClick={() => {
            this.handleListItemClick(0);
          }}
        >
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText id="dashboard_button" primary="Dashboard" />
        </ListItem>
        <ListItem
          button
          selected={selectedIndex === 1}
          onClick={() => {
            this.handleListItemClick(1);
          }}
        >
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText id="patient_button" primary="Current Patients" />
        </ListItem>
        <ListItem
          button
          selected={selectedIndex === 2}
          onClick={() => {
            this.handleListItemClick(2);
          }}
        >
          <ListItemIcon>
            <BarChartIcon />
          </ListItemIcon>
          <ListItemText id="upload_button" primary="Upload new data" />
        </ListItem>
      </List>
    );
  }
}

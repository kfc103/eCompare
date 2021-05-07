import React from "react";
import PropTypes from "prop-types";
//import AppBar from "./AppBar";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import CssBaseline from "@material-ui/core/CssBaseline";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import Slide from "@material-ui/core/Slide";
import List from "./List";
import { useStyles } from "./Styles";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = { showInstalledMessage: false, showUpdateMessage: false };
  }

  componentDidMount() {
    const { appServiceWorker } = this.props;
    appServiceWorker.onInstalled(() =>
      this.setState({ showInstalledMessage: true })
    );
    appServiceWorker.onUpdateFound(() =>
      this.setState({ showUpdateMessage: true })
    );
    console.log(appServiceWorker);
  }
  render() {
    //const classes = useStyles();
    const classes = "";

    return (
      <React.Fragment>
        <CssBaseline />
        <AppBar>
          <Toolbar>
            <Typography variant="h6">eCompare</Typography>
          </Toolbar>
        </AppBar>
        <Toolbar />
        <div>
          {this.state.showInstalledMessage ? "true" : "false"}
          {this.state.showUpdateMessage ? "true" : "false"}
        </div>
        <List classes={classes} />
      </React.Fragment>
    );
  }
}

export default App;

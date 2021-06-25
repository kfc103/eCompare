import React from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import CssBaseline from "@material-ui/core/CssBaseline";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import Slide from "@material-ui/core/Slide";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import RefreshIcon from "@material-ui/icons/Refresh";
import Alert from "@material-ui/lab/Alert";
import List from "./List";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

const darkTheme = createMuiTheme({
  palette: {
    type: "dark"
  }
});
const lightTheme = createMuiTheme({
  palette: {
    type: "light"
  }
});

function HideOnScroll(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({ target: window ? window() : undefined });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

HideOnScroll.propTypes = {
  children: PropTypes.element.isRequired,
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func
};

class App extends React.Component {
  constructor(props) {
    super(props);

    const isDarkTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches;

    this.state = {
      showInstalledMessage: false,
      showUpdateMessage: false,
      isDarkTheme: isDarkTheme,
      theme: isDarkTheme ? darkTheme : lightTheme
    };
  }

  componentDidMount() {
    const { appServiceWorker } = this.props;
    appServiceWorker.onInstalled(() =>
      this.setState({ showInstalledMessage: true })
    );
    appServiceWorker.onUpdateFound(() =>
      this.setState({ showUpdateMessage: true })
    );

    const mqListener = (e) => {
      //setIsDarkTheme(e.matches);
      if (e.matches) {
        // Theme set to dark.
        //console.log("Theme set to dark.");
        this.setState({ theme: darkTheme });
      } else {
        // Theme set to light.
        //console.log("Theme set to light.");
        this.setState({ theme: lightTheme });
      }
    };

    const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
    darkThemeMq.addListener(mqListener);
  }

  refreshPage() {
    window.location.reload(false);
  }

  render() {
    return (
      <React.Fragment>
        <ThemeProvider theme={this.state.theme}>
          <CssBaseline />
          <HideOnScroll {...this.props}>
            <AppBar>
              <Toolbar>
                <Typography variant="h6">eCompare</Typography>
              </Toolbar>
            </AppBar>
          </HideOnScroll>
          <Toolbar />
          <Collapse in={this.state.showInstalledMessage}>
            <Alert
              severity="info"
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    this.setState({ showInstalledMessage: false });
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
              The app has been installed
            </Alert>
          </Collapse>
          <Collapse in={this.state.showUpdateMessage}>
            <Alert
              severity="info"
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => this.refreshPage()}
                >
                  <RefreshIcon fontSize="inherit" />
                </IconButton>
              }
            >
              There is an new update, please refresh
            </Alert>
          </Collapse>
          <List />
        </ThemeProvider>
      </React.Fragment>
    );
  }
}

export default App;

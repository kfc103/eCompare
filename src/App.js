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

export default function App(props) {
  const classes = useStyles();

  /*if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then(function (registration) {
        registration.addEventListener("updatefound", function () {
          // If updatefound is fired, it means that there's
          // a new service worker being installed.
          var installingWorker = registration.installing;
          console.log(
            "A new service worker is being installed:",
            installingWorker
          );

          // You can listen for changes to the installing service worker's
          // state via installingWorker.onstatechange
        });
      })
      .catch(function (error) {
        console.log("Service worker registration failed:", error);
      });
  } else {
    console.log("Service workers are not supported.");
  }*/
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/test.js")
      .then((reg) => {
        // registration worked
        console.log("Registration succeeded. Scope is " + reg.scope);
        console.log(reg);
      })
      .catch((error) => {
        // registration failed
        console.log("Registration failed with " + error);
      });
  } else {
    console.log("Service workers are not supported.");
  }

  const nav = navigator;
  console.log(nav.serviceWorker);

  return (
    <React.Fragment>
      <CssBaseline />
      <HideOnScroll {...props}>
        <AppBar>
          <Toolbar>
            <Typography variant="h6">eCompare</Typography>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar />
      <List classes={classes} />
    </React.Fragment>
  );
}

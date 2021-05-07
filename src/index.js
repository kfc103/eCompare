import { StrictMode } from "react";
import ReactDOM from "react-dom";
import "./styles.css";

import App from "./App";
import registerServiceWorker from "react-service-worker";

const rootElement = document.getElementById("root");
const appSW = registerServiceWorker();

ReactDOM.render(
  <StrictMode>
    <App appServiceWorker={appSW} />
  </StrictMode>,
  rootElement
);

//registerServiceWorker();

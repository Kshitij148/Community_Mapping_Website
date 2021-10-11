import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import store from "./redux-store/store";
import { Provider } from "react-redux";
import "mapbox-gl/dist/mapbox-gl.css";
import "semantic-ui-css/semantic.min.css";
import 'font-awesome/css/font-awesome.min.css';
import "./index.css";

import App from "./App";

// React Strict Mode is causing errors in Google Maps only.

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      {/* <React.StrictMode>  */}
      <React.Fragment>
        <App />
      </React.Fragment>
      {/* <React.StrictMode> */}
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);

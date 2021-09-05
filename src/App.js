/*
 * This file simulates our Home page.
 * It is where we hold our frontend routes and
 * display the contents of our home page.
 */

// Imports include libraries/dependencies/packages that we use in our application.
import React from "react";
import { Fragment } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from "react-router-dom";



//import login component and its css
import Login from "./components/login";
import "./assets/css/login.css";

//import register component and its css
import Register from "./components/register";
import "./assets/css/register.css";

// All other components in our application
import Profile from "./components/Profile";
// import NavBar from "./components/NavBar";
import BaseMaps from "./components/BaseMaps/BaseMaps";

import {ProtectedRoute } from "./components/protected.route";

import auth from "./components/auth";






/* Application Begins Here */
export default function App() {

  return (
      <Router>
        <Fragment>
           <Route path="/" exact>
            < Login />
            </Route>
            
            <Route path="/register" exact>
            < Register />
            </Route>

            <ProtectedRoute 
            exact
            path="/map"
            component={BaseMaps}
            />

          <Switch>
            <Route path="/profile">
              <Profile />
            </Route>
          </Switch>
        </Fragment>
      </Router>
  );
}

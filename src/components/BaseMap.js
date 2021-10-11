/*
* Author: Maria Caravez
* Description: Contains the base map selection and dashboard.
*/

import React, { Fragment, useEffect, useState } from "react";

import {
  Button,
  Form,
  Icon,
  Menu,
  Dropdown,
  Container,
  Popup,
} from "semantic-ui-react";

// Routing for Landing Page
import { Link } from "react-router-dom";

// Redux Store Accessibility
import { useDispatch, useSelector } from "react-redux";
import { aoiActions } from "../redux-store/aoiSlice";

// Base Map Components
import MapBoxBase from "./BaseMaps/MapBoxBase";
import BingBase from "./BaseMaps/BingBase";
import GoogleBase from "./BaseMaps/GoogleBase";
import Dashboard from "./Dashboard";
import  LogoutBtn  from "./logoutbtn";



// Base Map Selection Object
const basemaps = [
  { key: "MB", text: "Mapbox", value: 1 },
  { key: "B", text: "Bing", value: 2 },
  { key: "G", text: "Google Maps", value: 3 },
];




/* Component Begins Here */
const BaseMap = () => {

    var getsession = window.sessionStorage.getItem("username");

  // Used to set variables in Redux store
  const dispatch = useDispatch();

  // Local variable for base map selection; default is Mapbox
  const [basemapSelection, setBaseMapSelection] = useState(1);


  // Sets the base map value if dropdown is changed
  const handleBaseMap = (e, { value }) => {
    setBaseMapSelection(value);
  };

  // Notifies current base map to retrieve AoI info
  const getMapInfo = () => {
    dispatch(aoiActions.updateInfo({ update: true }));
  };


  return (
    <Fragment>
      <Menu>
        <Menu.Item as={Link} to="/">
          Community Mapping Web Application
        </Menu.Item>
              <Menu.Menu position="right">
                  <Menu.Item>
                      Hello {getsession}!
        </Menu.Item>
          <Menu.Item>
            <Icon name="map" />
            <Dropdown
              selection
              header="Choose Base Map"
              options={basemaps}
              defaultValue={basemapSelection}
              onChange={handleBaseMap}
            />
          </Menu.Item>
          {/* Dashboard Begins */}
          <Menu.Item position="right">
            <Popup
              basic
              trigger={
                <Form onSubmit={getMapInfo}>
                  <Button
                    color="blue"
                    content="Dashboard"
                    type="submit"
                    onClick={getMapInfo}
                  />
                </Form>
              }
              content={<Dashboard />}
              on="click"
              hideOnScroll
              wide="very"
            ></Popup>
            {/* Dashboard Ends */}
          </Menu.Item>
          <Menu.Item>
            < LogoutBtn />
          </Menu.Item>
        </Menu.Menu>
      </Menu>
      {/* Displays base map depending on dropdown selection */}
      <Container fluid className="map-container">
        {basemapSelection === 1 && <MapBoxBase />}
        {basemapSelection === 2 && <BingBase />}
        {basemapSelection === 3 && <GoogleBase />}
      </Container>
    </Fragment>
  );
};

export default BaseMap;

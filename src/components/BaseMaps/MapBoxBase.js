/*
 * Base Map #1
 * Coordinates to test: 37.4848 N, 122.2281 W
 */
import React, { useRef, useEffect, useState } from "react";
import env from "react-dotenv";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Input,
  Form,
  Icon,
  Segment,
  Modal,
  Container,
  Grid,
  Label,
  List,
} from "semantic-ui-react";
import { mapInfoActions } from "../../mapSlice";
import { aoiActions } from "../../areaOfInterest";

import Dashboard from "../Dashboard";

//"pk.eyJ1IjoidGltd2lsbGFlcnQiLCJhIjoiY2s1d2l0Ym5yMDlhdTNobnhhaDNsY2hwYSJ9.oVOhCQf5j61IBbpYvhzLwA";
mapboxgl.accessToken = "pk.eyJ1IjoidGltd2lsbGFlcnQiLCJhIjoiY2s1d2l0Ym5yMDlhdTNobnhhaDNsY2hwYSJ9.oVOhCQf5j61IBbpYvhzLwA";

const MapBoxBase = () => {
  const dispatch = useDispatch();

  // Geocoding Setup
  const mbxClient = require("@mapbox/mapbox-sdk");
  const geocoder = require("@mapbox/mapbox-sdk/services/geocoding");
  const baseClient = mbxClient({ accessToken: "pk.eyJ1IjoidGltd2lsbGFlcnQiLCJhIjoiY2s1d2l0Ym5yMDlhdTNobnhhaDNsY2hwYSJ9.oVOhCQf5j61IBbpYvhzLwA" });
  const geocodingClient = geocoder(baseClient);

  // For Map Initialization
  const mapContainer = useRef(null);
  const map = useRef(null);

  const lng = useSelector((state) => state.mapInfo.lng);
  const lat = useSelector((state) => state.mapInfo.lat);
  const zoom = useSelector((state) => state.mapInfo.zoom);

  const communityName = useSelector((state) => state.mapInfo.communityName);
  const communityLocation = useSelector((state) => state.mapInfo.communityLocation);


  const [lngField, setLngField] = useState(lng);
  const [latField, setLatField] = useState(lat);
  const [zoomField, setZoomField] = useState(zoom);

  // Dashboard Variables
  const [openDashboard, setOpenDashboard] = useState(false);

  /* Redux Testing Purposes */
  // useEffect(() => {
  //   setLngField(lng);
  // }, [lng]);

  // useEffect(() => {
  //   setLatField(lat);
  // }, [lat]);

  // useEffect(() => {
  //   setZoomField(zoom);
  // }, [zoom]);

  /* Set Map Input Fields Begins */
  const handleLng = (e, { value }) => {
    setLngField(value);
    // dispatch(setLng(lngField));
  };

  const handleLat = (e, { value }) => {
    setLatField(value);
    // dispatch(setLat(latField));
  };

  const handleZoom = (e, { value }) => {
    setZoomField(value);
    // dispatch(setZoom(zoomField));
  };

  /* Set Map Input Fields Ends */

  // Initialize Map
  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/satellite-v9",
      center: [lngField, latField],
      zoom: zoomField,
    });

    // Add zoom +/- controls
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
  });

  // Update map as fields change
  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on("move", () => {
      setLngField(map.current.getCenter().lng.toFixed(4));
      setLatField(map.current.getCenter().lat.toFixed(4));
      setZoomField(map.current.getZoom().toFixed(2));
    });
  });

  // Set the Area of Interest
  const setAoI = () => {
    map.current.flyTo({
      center: [lngField, latField],
      zoom: zoomField,
      essential: true,
    });

    // Set variables in Map Info Redux slice
    dispatch(mapInfoActions.setLat({ lat: latField }));
    dispatch(mapInfoActions.setLng({ lng: lngField }));
    dispatch(mapInfoActions.setZoom({ zoom: zoomField }));

    // Set variables in AoI Redux slice
    dispatch(aoiActions.setLongitude({ longitude: lngField }));
    dispatch(aoiActions.setLatitude({ latitude: latField }));

    getCommunityLocation();
    console.log("Location: ", communityLocation);
    
    getCommunityName();
    console.log("Name: ", communityName);

  };

  const getCommunityLocation = () => {

    var lngF = Number(lngField);
    var latF = Number(latField);

    geocodingClient
      .reverseGeocode({
        // Longitude, Latitude (format)
        query: [lngF, latF],
        types: ["address"],
        bbox: [lngF - 0.001, latF - 0.001, lngF + 0.001, latF + 0.001],
      })
      .send()
      .then((response) => {
        // GeoJSON document with geocoding matches
        console.log(response.body);
        try {
            // console.log("Address Found!")
            console.log(response.body.features[0].place_name);
            dispatch(
              aoiActions.setLocation({
                location: response.body.features[0].place_name,
              })
            );

        } catch {
          // console.log("No address nearby.");
          dispatch(
            aoiActions.setLocation({ location: "No Address" })
          );
        }
      });
  };

  const getCommunityName = () => {
    var lngF = Number(lngField);
    var latF = Number(latField);
    geocodingClient
      .reverseGeocode({
        // Longitude, Latitude (format)
        query: [lngF, latF],
        types: ["neighborhood"],
        bbox: [lngF - 0.001, latF - 0.001, lngF + 0.001, latF + 0.001],
      })
      .send()
      .then((response) => {
        // GeoJSON document with geocoding matches
        console.log(response.body);
        try {
          dispatch(
            aoiActions.setName({ name: response.body.features[0].place_name })
          );
        } catch {
          console.log("No neighborhood nearby.");
          dispatch(
            mapInfoActions.setCommunityName({ communityName: "NOT FOUND" })
          );
        }
      });
    // console.log("Redux Community Name: ", communityName);
  };

  // Slider Updates the Area of Interest
  const moveSlider = (e, { value }) => {
    setZoomField(value);
    map.current.flyTo({
      center: [lngField, latField],
      zoom: value,
      essential: true,
    });
  };

  return (
    <div style={{ alignSelf: "center" }}>
      <div ref={mapContainer} className="map-container">
        <Form
          onSubmit={setAoI}
          className="coordinates onMap"
          style={{ maxWidth: "50%", top: "1vh", left: "1vw" }}
          label="Area of Interest"
        >
          {/* Area of Interest Input Fields Begins */}
          <Form.Group>
            <Form.Field>
              <Input
                label={{ basic: true, content: "Longitude" }}
                focus
                type="number"
                step="0.000001"
                min="-180"
                max="180"
                size="small"
                placeholder="-74.5"
                value={lngField}
                onChange={handleLng}
              />
            </Form.Field>

            <Form.Field>
              <Input
                label={{ basic: true, content: "Latitude" }}
                focus
                type="number"
                step="0.000001"
                min="-90"
                max="90"
                size="small"
                placeholder="40"
                value={latField}
                onChange={handleLat}
              />
            </Form.Field>
            <Form.Field>
              <Input
                label={{ basic: true, content: "Zoom" }}
                focus
                type="number"
                step="0.01"
                min="1"
                max="22"
                size="small"
                placeholder="17"
                value={zoomField}
                onChange={handleZoom}
              />
            </Form.Field>
            {/* Area of Interest Input Fields Ends */}

            <Button color="green" type="submit">
              Set AoI
            </Button>

            {/* Dashboard Begins */}
            <Modal
              className="dashboard"
              basic
              dimmer="inverted"
              onClose={() => setOpenDashboard(false)}
              onOpen={() => setOpenDashboard(true)}
              open={openDashboard}
              trigger={<Button color="yellow">Dashboard</Button>}
              size="mini"
              className="alignment"
            >
              <Container>
                <Segment size="small" padded>
                  <Grid>
                    <Grid.Column>
                      <Dashboard />
                    </Grid.Column>
                  </Grid>
                </Segment>
              </Container>

              <Modal.Actions className="alignment">
                <Button
                  color="black"
                  size="tiny"
                  onClick={() => setOpenDashboard(false)}
                >
                  Cancel
                </Button>
              </Modal.Actions>
            </Modal>
            {/* Dashboard Ends */}
          </Form.Group>
        </Form>

        {/* Slider Begins */}
        <Input
          className="slider"
          type="range"
          min="1"
          max="22"
          value={zoomField}
          onChange={moveSlider}
        >
          <Icon circular inverted name="minus" />
          <input />
          <Icon circular inverted name="plus" />
        </Input>
        {/* Slider Ends */}
      </div>
    </div>
  );
};

export default MapBoxBase;

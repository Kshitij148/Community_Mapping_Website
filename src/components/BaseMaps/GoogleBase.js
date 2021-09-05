/*
* Base Map #3
*/

import React from "react";
import env from "react-dotenv";
import { useSelector, useDispatch } from "react-redux";
import {
  withGoogleMap,
  withScriptjs,
  GoogleMap,
} from "react-google-maps";

function Map() {
  const lng = useSelector((state) => state.mapInfo.lng)
  const lat = useSelector((state) => state.mapInfo.lat)

  const googleToken = env.G_TOKEN;

  return (
    <GoogleMap
      defaultZoom={2}
      defaultCenter={{ lat: {lat}, lng: {lng}}}
    >
    </GoogleMap>
  );
}

const G_BaseMap = withScriptjs(withGoogleMap(Map));

export default function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <G_BaseMap
        // "https://maps.googleapis.com/maps/api/js?key=${googleToken}&v=3.exp&libraries=geometry,drawing,places"
        googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `100%` }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
    </div>
  );
}
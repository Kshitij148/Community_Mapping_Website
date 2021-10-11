/*
 * Base Map #3
 */

import React from "react";
import env from "react-dotenv";
import { useSelector } from "react-redux";
import { withGoogleMap, withScriptjs, GoogleMap } from "react-google-maps";

function Map() {
  const lng = useSelector((state) => state.mapInfo.lng);
  const lat = useSelector((state) => state.mapInfo.lat);
  const zoom = useSelector((state) => state.mapInfo.zoom);

  return (
    <GoogleMap
      defaultZoom={zoom}
      defaultCenter={{ lat: { lat }, lng: { lng } }}
    />
  );
}

const GoogleBaseMap = withScriptjs(withGoogleMap(Map));

export default function GoogleBase() {
  const googleToken = env.G_TOKEN;

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <GoogleBaseMap
        googleMapURL={`https://maps.googleapis.com/maps/api/js?&v=3.exp&libraries=geometry,drawing,places&key=${googleToken}`}
        loadingElement={<div style={{ height: "100%" }} />}
        containerElement={<div style={{ height: "100%" }} />}
        mapElement={<div style={{ height: "100%" }} />}
      />
    </div>
  );
}

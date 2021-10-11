/*
* Base Map #2
*/

import React from "react";
import { useSelector } from "react-redux";
import BingMapsReact from "bingmaps-react";
import env from "react-dotenv";

const BingBase = () => {
  const lng = useSelector((state) => state.mapInfo.lng)
  const lat = useSelector((state) => state.mapInfo.lat)

  const bingToken = env.B_TOKEN;
  
  return (
    <BingMapsReact
      bingMapsKey={bingToken}
      height="100%"
      mapOptions={{ navigationBarMode: "square" }}
      width="100%"
      viewOptions={{center: {latitude: {lng}, longitude: {lat}}, mapTypeId: "aerial"}}
    />
  );
};

export default BingBase;

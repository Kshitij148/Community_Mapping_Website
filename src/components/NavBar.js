// import React, { useEffect, useState } from "react";
// import { Menu, Dropdown, Input, Icon } from "semantic-ui-react";
// import { Link } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { setLat, setLng, setZoom, setCurrentMap } from "../mapSlice";

// const basemaps = [
//   { key: "MB", text: "MapBox", value: 1 },
//   { key: "B", text: "Bing", value: 2 },
//   { key: "G", text: "Google Maps", value: 3 },
// ];

// const NavBar = () => {
//   const dispatch = useDispatch();

//   // Gets current state of mapInfo from Redux store
//   const lng = useSelector((state) => state.mapInfo.lng);
//   const lat = useSelector((state) => state.mapInfo.lat);
//   const zoom = useSelector((state) => state.mapInfo.zoom);

//   // Base map options
//   const [basemap, setBaseMap] = useState(null);
//   const currentMap = useSelector((state) => state.mapInfo.currentMap);

//   useEffect(() => {
//     console.log(basemap);
//     setBaseMap(currentMap);
//   }, []);

//   const handleBaseMap = (e, {value}) => {
//     setBaseMap(value);
//   }

//   return (
//     <Menu size="huge">
//       <Menu.Item as={Link} to="/">
//         Home
//       </Menu.Item>
//       <Menu.Item>
//         <Icon name="map" />
//         <Dropdown
//           inline
//           selection
//           header="Choose Base Map"
//           options={basemaps}
//           // value={basemap}
//           defaultValue={basemaps[0].value}
//           onChange={handleBaseMap}
//         />
//       </Menu.Item>

//       <Menu.Menu position="right">
//         <Menu.Item>
//           <Input
//             type="number"
//             min="-180"
//             max="180"
//             size="mini"
//             placeholder="-74.5"
//             label={{ content: "Longitude" }}
//             style={{ paddingRight: "1vw" }}
//             value={lng}
//             onChange={(e) => {
//               dispatch(setLng(e.target.value));
//             }}
//           />
//           <Input
//             type="number"
//             min="-90"
//             max="90"
//             size="mini"
//             placeholder="40"
//             label={{ content: "Latitude" }}
//             style={{ paddingRight: "1vw" }}
//             value={lat}
//             onChange={(e) => {
//               dispatch(setLat(e.target.value));
//             }}
//           />
//           <Input
//             type="number"
//             min="1"
//             max="22"
//             size="mini"
//             placeholder="17"
//             label={{ content: "Zoom" }}
//             value={zoom}
//             onChange={(e) => {
//               dispatch(setZoom(e.target.value));
//             }}
//           />
//         </Menu.Item>
//       </Menu.Menu>
//     </Menu>
//   );
// };

// export default NavBar;

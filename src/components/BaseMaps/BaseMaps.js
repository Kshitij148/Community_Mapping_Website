import React from "react";
import { Fragment, useEffect, useState,useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Input, Icon, Dropdown, Menu, Button, Form,Checkbox} from "semantic-ui-react";
import MapBoxBase from "./MapBoxBase";
import BingBase from "./BingBase";
import GoogleBase from "./GoogleBase";
import { minusZoom, plusZoom, setZoom } from "../../mapSlice";
import LogoutBtn from "../logoutbtn";
import L, { layerGroup } from "leaflet";
import { Map, TileLayer, LayersControl, LayerGroup, Marker,Pane } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import parseGeoraster from "georaster";
import GeoRasterLayer from "georaster-layer-for-leaflet";
import { BingLayer } from "react-leaflet-bing";
import Control from 'react-leaflet-control';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import LayersControl2, { ControlledLayerItem } from "./LayerControl2";
import { SimpleMapScreenshoter } from 'leaflet-simple-map-screenshoter';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import ButtonNew from '@material-ui/core/Button';
import FileSaver from "file-saver";
import FormData from "form-data";
import axios from "axios";

import zipUrl from "./building.zip";
import flood from "./10yearflooding.zip";
import Shapefile from "../Shapefile";
import App from '../raster';
import MapInfo from './Shape';





const BaseMaps = () => {




    var getsession = window.sessionStorage.getItem("username");
    console.log(getsession);

  

    
    


    const mapRef = useRef();
    const bing_key = "Alx0Z57lZMDbjYArKwl_YWvJ85F7x8YerS4cdc52bVkhVuMZJYKuSwVZmTIkeGEa";
  


   

    const [showGrid, setShowGrid] = useState(false);
    const [showGrid2, setShowGrid2] = useState(false);
    var d = { Flooding10year: false, Building: false, Flood10YearCommunity: false }
    

    const [state, setState] = useState(d);
   
   
    const [lngField, setLngField] = useState(-0.09);
    const [latField, setLatField] = useState(51.505);
    const [zoomField, setZoomField] = useState(13);
    const [position, setPosition] = useState([51.505, -0.09])
    const cordInput1 = React.useRef(null)
    const cordInput2 = React.useRef(null)
    const cordInput3 = React.useRef(null)
    const cordButton = React.useRef(null)
   

     

    console.log("data");
    console.log(position);

    useEffect(() => {

        const dt = fetch("http://localhost:3000/shape_files/building.zip" ).then(r => console.log(r));
    
        const map = mapRef.current.leafletElement;

        console.log(map.getCenter());
       
       
       

        for (const value in d) {
            map.on("overlayadd", (e) => {
                console.log(value);
                if (e.name === value) setState(state => ({ ...state, [value]: true }));
                //if (e.name === "Layer3") setState(state => ({ ...state, Layer3: true }));

            });
            map.on("overlayremove", (e) => {
                if (e.name === value) setState(state => ({ ...state, [value]: false }));
                // if (e.name === "Layer3") setState(state => ({ ...state, Layer3: false }));

            });
        }





    }, []);

    const handleLng = (e, { value }) => {
        setLngField(value);
        console.log(value);
        // dispatch(setLng(lngField));
    };

    const handleLat = (e, { value }) => {
        setLatField(value);
        console.log(value);
        // dispatch(setLat(latField));
    };

    const handleZoom = (e, { value }) => {
        setZoomField(value);

        console.log(value);
        // dispatch(setZoom(zoomField));
    };


    var handleEvent = (event) => {
        const map = mapRef.current.leafletElement;
        try {
            console.log(map.getCenter());
            if (document.activeElement.id != cordButton.current.props.id && document.activeElement.id != cordInput1.current.props.id && document.activeElement.id != cordInput2.current.props.id && document.activeElement.id != cordInput3.current.props.id) {
                setLngField(map.getCenter()["lng"].toFixed(6));
                setLatField(map.getCenter()["lat"].toFixed(6));

            }
        } catch (e) {
            console.log("error");
        }
       
    }

    
    const setAoI = () => {
        const map = mapRef.current.leafletElement;
        setPosition([latField,lngField]);
        map.setView(position, zoomField);

    }

    

    const capture = () => {

        let plugin = {
            hidden: true 
        }
        const map = mapRef.current.leafletElement;
        const screenshot = new SimpleMapScreenshoter(plugin);
        screenshot.addTo(map);
        let format = 'blob' // 'image' - return base64, 'canvas' - return canvas
        let overridedPluginOptions = {
            mimeType: 'image/png'
        }
        screenshot.takeScreen(format, overridedPluginOptions).then(blob => {
            console.log(blob);
           
            let data = new FormData();
            data.append('file', blob);
            axios.post("/time", data, {

                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

           

                     
        }).catch(e => {
            console.error(e)
        })
        console.log("Button Clicked");


       
    }

  
  

    /*
  const dispatch = useDispatch();

   Longitude 
  const [lngField, setLngField] = useState(-74.5);
  const lng = useSelector((state) => state.mapInfo.lng);

  useEffect(() => {
    setLngField(lng);
  }, [lng]);

  const handleLng = (e, { value }) => {
    setLngField(value);
  };

   Latitude 
  const [latField, setLatField] = useState(40);
  const lat = useSelector((state) => state.mapInfo.lat);

  useEffect(() => {
    setLatField(lat);
  }, [lat]);

  const handleLat = (e, { value }) => {
    setLatField(value);
  };

   Zoom 
  const [zoomField, setZoomField] = useState(2);
  const zoom = useSelector((state) => state.mapInfo.zoom);

  useEffect(() => {
    setZoomField(zoom);
  }, [zoom]);

  const handleZoom = (e, { value }) => {
    setZoomField(value);
    };
*/ 

  /* Base Map */
  

  

  // 37.722291, -122.478854


  return (
    <Fragment>
          <Menu style={{ margin: "0mm"}}>
        <Menu.Item>
          Home
        </Menu.Item>
        <Menu.Item>
          <Icon name="map" />
         
        </Menu.Item>
        <Menu.Menu position="right">
          
          <Menu.Item>
          Hello {getsession}!
          </Menu.Item>
          <Menu.Item>
            < LogoutBtn />
          </Menu.Item>
        </Menu.Menu>
          </Menu>
          <Map center={position} zoom={zoomField} style={{ height: "100vh" }} ref={mapRef} onMouseUp={handleEvent} >

              <Control>
                  <Form
                      onSubmit={setAoI}
                      className="coordinates onMap"
                      style={{ maxWidth: "50%", top: "1vh", left: "1vw" }}
                      label="Area of Interest"
                  >
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
                                  ref={cordInput1}
                                  value={lngField}
                                  onChange={handleLng}
                                  id="i1"
                                 
                            
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
                                 
                                  value={latField}
                                  onChange={handleLat}
                                  ref={cordInput2}
                                  id="i2"
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
                                  ref={cordInput3}
                                  value={zoomField}
                                  onChange={handleZoom}
                                  id="i3"
                          />
                          </Form.Field>
                          <Button color="green" type="submit" ref={ cordButton} id="b1">
                              Set AoI
            </Button>
                      </Form.Group>
                  </Form>

                 
              </Control>

              

              <Control position="topleft">
               

                  <ButtonNew
                      variant="contained"
                      color="secondary"

                      startIcon={<PhotoCamera />}
                      onClick={capture}
                  >
       
                </ButtonNew>

                </Control>
             

              <LayersControl2 position="topright">
               
                  <ControlledLayerItem
                      checked={false}
                      name="OpenStreetMap"
                      group="BaseLayers"
                  >
                      <BingLayer bingkey={bing_key} />
                      
                  </ControlledLayerItem>
                  <ControlledLayerItem
                      checked={false}
                      name="Rectangle"
                      group="Rectangles"
                  >
                     
                      
                  </ControlledLayerItem>
                  </LayersControl2>
              
             

              <LayersControl  collapsed={false} position="topleft">
                
                          
                  
                  <LayersControl.BaseLayer name="OpenStreetMap" >
                      <BingLayer bingkey={bing_key} />
                  
                          </LayersControl.BaseLayer>
                
               
                  <LayersControl.Overlay name="Flooding10year">
                      <LayerGroup id="build">
                          <Shapefile zipUrl={zipUrl} flag={state.Flooding10year} name={"Flooding10year"} />
                      </LayerGroup>
                  </LayersControl.Overlay>
                  <LayersControl.Overlay name="Building">
                      <LayerGroup id="flood">
                          <Shapefile zipUrl={flood} flag={state.Building} name={"Building"} />
                      </LayerGroup>
                  </LayersControl.Overlay>
                  <LayersControl.Overlay name="Flood10YearCommunity">
                      <LayerGroup id="raster">
                          <App flag={state.Flood10YearCommunity} name={"Flood10YearCommunity"} />

                      </LayerGroup>
                  </LayersControl.Overlay>



             
              </LayersControl>
              
                  

        </Map>

      {/* <div className="coordinates">
        Longitude:
        <Input
          focus
          type="number"
          min="-180"
          max="180"
          size="mini"
          placeholder="-74.5"
          value={lngField}
          // defaultValue={lng}
          onChange={handleLng}
        />
        Latitude:
        <Input
          focus
          type="number"
          min="-90"
          max="90"
          size="mini"
          placeholder="40"
          value={latField}
          // defaultValue={lat}
          onChange={handleLat}
        />
        Zoom:
        <Input
          focus
          type="number"
          min="1"
          max="22"
          size="mini"
          placeholder="17"
          // defaultValue={zoom}
          value={zoomField}
          onChange={handleZoom}
        />
      </div> */}

      {/* Slider Begins */}
      {/* <Input
        className="slider"
        type="range"
        min="1"
        max="22"
        value={zoomField}
        onChange={handleZoom}
      >
        <Icon circular inverted name="minus" value={zoomField} />
        <input />
        <Icon circular inverted name="plus" value={zoomField} />
      </Input> */}
      {/* Slider Ends */}
    
    </Fragment>
  );
};

export default BaseMaps

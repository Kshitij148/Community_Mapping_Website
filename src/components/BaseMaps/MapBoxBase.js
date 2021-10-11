/*
 * Author: Maria Caravez
 * Description: This is Base Map #1 (used for logic in BaseMaps component)
 * It retrieves the map information from the Redux store mapSlice and
 * displays it accordingly.
 *
 * Map Information:
 * Longitude (X) [West-East] Range: -180 through +180
 * Latitude (Y) [North-South] Range: -90 through +90
 */
import React, { useRef, useEffect, useState } from "react";
import { Button, Input, Form, Icon, Label,Checkbox} from "semantic-ui-react";
import env from "react-dotenv";

import { useDispatch, useSelector } from "react-redux";
import { mapInfoActions } from "../../redux-store/mapSlice";
import { aoiActions } from "../../redux-store/aoiSlice";


import * as turf from "@turf/turf";
import bboxPolygon from "@turf/bbox-polygon";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax



import PhotoCamera from '@material-ui/icons/PhotoCamera';
import axios from "axios";
import { ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import '../custom.scss';
import '../checkbox.css';
import ReactFloatingDropdown from 'react-floating-dropdown';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css';

import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

mapboxgl.accessToken = "pk.eyJ1IjoidGltd2lsbGFlcnQiLCJhIjoiY2s1d2l0Ym5yMDlhdTNobnhhaDNsY2hwYSJ9.oVOhCQf5j61IBbpYvhzLwA";

// To retrieve area of current map view
turf.bboxPolygon = bboxPolygon;

const MapBoxBase = () => {
  const dispatch = useDispatch();

  // Geocoding Setup to retrieve community information
  const mbxClient = require("@mapbox/mapbox-sdk");
  const geocoder = require("@mapbox/mapbox-sdk/services/geocoding");
    const baseClient = mbxClient({ accessToken: "pk.eyJ1IjoidGltd2lsbGFlcnQiLCJhIjoiY2s1d2l0Ym5yMDlhdTNobnhhaDNsY2hwYSJ9.oVOhCQf5j61IBbpYvhzLwA"});
  const geocodingClient = geocoder(baseClient);

  // For Map Initialization
  const mapContainer = useRef(null);
  const map = useRef(null);

  // Redux Objects
  const lng = useSelector((state) => state.mapInfo.lng);
  const lat = useSelector((state) => state.mapInfo.lat);
  const zoom = useSelector((state) => state.mapInfo.zoom);

  const update = useSelector((state) => state.areaOfInterest.update);

  //Local Variables
  const [lngField, setLngField] = useState(lng);
  const [latField, setLatField] = useState(lat);
  const [zoomField, setZoomField] = useState(zoom);

  const [north, setNorth] = useState(0);
  const [east, setEast] = useState(0);
  const [south, setSouth] = useState(0);
  const [west, setWest] = useState(0);

    var d = {bl:false,kf:false,kp:false,int:false,bf:false,bd:false,kc: false,af:false,ac:false}
    const [state, setState] = useState(d);

  /* Set Map Input Fields Begins */
  const handleLng = (e, { value }) => {
    setLngField(value);
    dispatch(mapInfoActions.setLng({ lng: value }));
  };

  const handleLat = (e, { value }) => {
    setLatField(value);
    dispatch(mapInfoActions.setLat({ lat: value }));
  };

  const handleZoom = (e, { value }) => {
    setZoomField(value);
    dispatch(mapInfoActions.setZoom({ zoom: value }));
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
        preserveDrawingBuffer: true
    });

    map.current.addControl(
new MapboxGeocoder({
accessToken: "pk.eyJ1IjoidGltd2lsbGFlcnQiLCJhIjoiY2s1d2l0Ym5yMDlhdTNobnhhaDNsY2hwYSJ9.oVOhCQf5j61IBbpYvhzLwA",
mapboxgl: mapboxgl
})
);

    // Add zoom +/- controls
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
    
    


  });




  /* 
  *  HELPER FUNCTION: Sets map information in
  *  Redux store with current input field values
  */
  const setMapInfo = () => {
    dispatch(mapInfoActions.setLat({ lat: latField }));
    dispatch(mapInfoActions.setLng({ lng: lngField }));
    dispatch(mapInfoActions.setZoom({ zoom: zoomField }));
  };

  // Update map information in real-time
  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on("move", () => {
      setLngField(map.current.getCenter().lng.toFixed(4));
      setLatField(map.current.getCenter().lat.toFixed(4));
      setZoomField(map.current.getZoom().toFixed(2));
    });

    // Retrieves the extent of the map
    setEast(map.current.getBounds().getNorthEast().lng);
    setNorth(map.current.getBounds().getNorthEast().lat);
    setWest(map.current.getBounds().getSouthWest().lng);
    setSouth(map.current.getBounds().getSouthWest().lat);
  });

  // Continously checks update variable in order to refresh dashboard
  useEffect(() => {
    if (update) {
      setAoI();
    }
  });

    const setLayer = () => {

        if(state.bl==true){
            
       setState(state => ({ ...state, bl: false }));
   }
   else{
       
     setState(state => ({ ...state, bl: true }));
   }

        if (map.current.getLayer('streets-data')) {
            map.current.removeLayer('streets-data');
            map.current.removeSource('mapbox-streets');
        }
        else {
            console.log("In Function Layer");
            map.current.addSource('mapbox-streets', {
                type: 'vector',
                // Use any Mapbox-hosted tileset using its tileset id.
                // Learn more about where to find a tileset id:
                // https://docs.mapbox.com/help/glossary/tileset-id/
                url: 'mapbox://mapbox.mapbox-streets-v8'
            });
            map.current.addLayer({
                'id': 'streets-data',
                'type': 'fill',
                'source': 'mapbox-streets',
                'source-layer': 'building',
                'paint': {
                    'fill-color': '#4ddbff',
                    'fill-opacity': 0.6,
                    'fill-outline-color': '#0000b3'

                }

            });
        }
    };

    const setClip = () => {

       
        if(state.kc==true){
            console.log("##########");
       setState(state => ({ ...state, kc: false }));
   }
   else{
        console.log("*************");
     setState(state => ({ ...state, kc: true }));
   }


        if (map.current.getLayer('coolguy814.ddxbg17x')) {
               
                console.log("In here");
                map.current.removeLayer('coolguy814.ddxbg17x');
                map.current.removeSource('kentclip');
            }

        else{
        map.current.addSource("kentclip", {
            type: "raster",
            url: "mapbox://coolguy814.ddxbg17x"
        });
          

        map.current.addLayer(
            {
                id: "coolguy814.ddxbg17x",
                type: "raster",
                source: "kentclip"
            },

        );
         
    }

    }

       const setClip2 = () => {

        if(state.ac==true){
            
       setState(state => ({ ...state, ac: false }));
   }
   else{
       
     setState(state => ({ ...state, ac: true }));
   }
        
        console.log("In Clip2")

        if (map.current.getLayer("coolguy814.45oahs69")) {
               
                
                map.current.removeLayer("coolguy814.45oahs69");
                map.current.removeSource('afgclip');
            }


        map.current.addSource("afgclip", {
            type: "raster",
            url: "mapbox://coolguy814.45oahs69"
        });
          

        map.current.addLayer(
            {
                id: "coolguy814.45oahs69",
                type: "raster",
                source: "afgclip"
            },

        );
         


    }


    const setIntersection = () => {
        console.log("Intersection");
        var canvas = map.current.getCanvas();
        var w = canvas.width;
        var h = canvas.height;
        var cUL = map.current.unproject([0, 0]).toArray();
        var cUR = map.current.unproject([w, 0]).toArray();
        var cLR = map.current.unproject([w, h]).toArray();
        var cLL = map.current.unproject([0, h]).toArray();


        var coordinates = [cUL, cUR, cLR, cLL];

        axios.post("/intersect", {
            name: "intersect",
            coordinates: coordinates
        }, {

            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            console.log("Returned Result")
            console.log(res)
            if (map.current.getLayer('intersect')) {
                map.current.removeLayer('intersect');
                map.current.removeSource('intersect');
            }


            map.current.addSource("intersect", {
                type: "geojson",
                data: res["data"]

            });
            map.current.addLayer(
                {
                    'id': "intersect",
                    'type': "fill",
                    'source': "intersect",
                    'paint': {
                        'fill-color': '#ff3333',
                        'fill-opacity': 0.6,
                        'fill-outline-color': '#ff0000'

                    }

                }

            );
            console.log("Donee")
        });

    }

    const removeRaster = () => {


        if (map.current.getLayer('flood')) {
            map.current.removeLayer('flood');
            map.current.removeSource('flood');
        }
        if (map.current.getLayer('floodkent')) {
            map.current.removeLayer('floodkent');
            map.current.removeSource('floodkent');
        }
        if (map.current.getLayer('parcels')) {
            map.current.removeLayer('parcels');
            map.current.removeSource('parcels');
        }
        if (map.current.getLayer('intersect2')) {
            map.current.removeLayer('intersect2');
            map.current.removeSource('intersect2');
        }
        if (map.current.getLayer('coolguy814.ddxbg17x')) {

            console.log("In here");
            map.current.removeLayer('coolguy814.ddxbg17x');
            map.current.removeSource('kentclip');
        }
        if (map.current.getLayer('intersect')) {
            map.current.removeLayer('intersect');
            map.current.removeSource('intersect');
        }
        if (map.current.getLayer('intersect3')) {
            map.current.removeLayer('intersect3');
            map.current.removeSource('intersect3');
        }
        if (map.current.getLayer('detect')) {
            console.log("In Here");
            map.current.removeLayer('detect');
            map.current.removeSource('detect');
        }
         if (map.current.getLayer('coolguy814.15kjj0ab')) {

            console.log("In here");
            map.current.removeLayer('coolguy814.15kjj0ab');
            map.current.removeSource('afgclip');
        }
          if (map.current.getLayer('floodblks')) {
                map.current.removeLayer('floodblks');
                map.current.removeSource('floodblks');
            }
             if (map.current.getLayer('intersect4')) {
                    map.current.removeLayer('intersect4');
                    map.current.removeSource('intersect4');
                }
                 if (map.current.getLayer('intersect5')) {
                    map.current.removeLayer('intersect5');
                    map.current.removeSource('intersect5');
                }


    }

    const setIntersect2 = () => {

        if(state.int==true){
            
       setState(state => ({ ...state, int: false }));
   }
   else{
       
     setState(state => ({ ...state, int: true }));
   }

        if(map.current.getLayer('intersect2') || map.current.getLayer('intersect3') || map.current.getLayer('intersect4') || map.current.getLayer('intersect5') || map.current.getLayer('intersect')){

                 if (map.current.getLayer('intersect2')) {
                    map.current.removeLayer('intersect2');
                    map.current.removeSource('intersect2');
                }

                if (map.current.getLayer('intersect3')) {
                    map.current.removeLayer('intersect3');
                    map.current.removeSource('intersect3');
                }

                  if (map.current.getLayer('intersect4')) {
                    map.current.removeLayer('intersect4');
                    map.current.removeSource('intersect4');
                }

                if (map.current.getLayer('intersect5')) {
                    map.current.removeLayer('intersect5');
                    map.current.removeSource('intersect5');
                }

                 if (map.current.getLayer('intersect')) {
                map.current.removeLayer('intersect');
                map.current.removeSource('intersect');
            }




        }

        else{

        if (map.current.getLayer('parcels')) {

            
            axios.post("/intersect2", {
                name: "intersect2",
                coordinates: "Success"
            }, {

                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => {
                console.log("Returned Result")
                console.log(res)

                if (map.current.getLayer('intersect2')) {
                    map.current.removeLayer('intersect2');
                    map.current.removeSource('intersect2');
                }

                map.current.addSource("intersect2", {
                    type: "geojson",
                    data: res["data"]

                });
                map.current.addLayer(
                    {
                        'id': "intersect2",
                        'type': "fill",
                        'source': "intersect2",
                        'paint': {
                            'fill-color': '#ff3333',
                            'fill-opacity': 0.6,
                            'fill-outline-color': '#ff0000'

                        }
                    },

                );

                console.log("Donee");

            });;
            
        }

        if (map.current.getLayer('streets-data') && map.current.getLayer('floodkent') ) {

            
            

            var canvas = map.current.getCanvas();
            var w = canvas.width;
            var h = canvas.height;
            var cUL = map.current.unproject([0, 0]).toArray();
            var cUR = map.current.unproject([w, 0]).toArray();
            var cLR = map.current.unproject([w, h]).toArray();
            var cLL = map.current.unproject([0, h]).toArray();

            var coordinates = [cUL, cUR, cLR, cLL];

            axios.post("/intersect3", {
                name: "intersect3",
                coordinates: coordinates
            }, {

                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => {
                console.log("Returned Result")
                console.log(res)

                if (map.current.getLayer('intersect3')) {
                    map.current.removeLayer('intersect3');
                    map.current.removeSource('intersect3');
                }

                map.current.addSource("intersect3", {
                    type: "geojson",
                    data: res["data"]

                });
                map.current.addLayer(
                    {
                        'id': "intersect3",
                        'type': "fill",
                        'source': "intersect3",
                        'paint': {
                            'fill-color': '#ff3333',
                            'fill-opacity': 0.6,
                            'fill-outline-color': '#ff0000'

                        }
                    },

                );

                console.log("Donee");

            });;




        }


        if (map.current.getLayer('streets-data') && map.current.getLayer('floodblks') ) {

            var canvas = map.current.getCanvas();
            var w = canvas.width;
            var h = canvas.height;
            var cUL = map.current.unproject([0, 0]).toArray();
            var cUR = map.current.unproject([w, 0]).toArray();
            var cLR = map.current.unproject([w, h]).toArray();
            var cLL = map.current.unproject([0, h]).toArray();

            var coordinates = [cUL, cUR, cLR, cLL];

            axios.post("/intersect4", {
                name: "intersect4",
                coordinates: coordinates
            }, {

                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => {
                console.log("Returned Result")
                console.log(res)

                if (map.current.getLayer('intersect4')) {
                    map.current.removeLayer('intersect4');
                    map.current.removeSource('intersect4');
                }

                map.current.addSource("intersect4", {
                    type: "geojson",
                    data: res["data"]

                });
                map.current.addLayer(
                    {
                        'id': "intersect4",
                        'type': "fill",
                        'source': "intersect4",
                        'paint': {
                            'fill-color': '#ff3333',
                            'fill-opacity': 0.6,
                            'fill-outline-color': '#ff0000'

                        }
                    },

                );

                console.log("Donee");

            });;

        }

          if(map.current.getLayer('detect')){

                 axios.post("/intersect5", {
                name: "intersect5",
                coordinates: "Success"
            }, {

                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => {
                console.log("Returned Result")
                console.log(res)

                if (map.current.getLayer('intersect5')) {
                    map.current.removeLayer('intersect5');
                    map.current.removeSource('intersect5');
                }

                map.current.addSource("intersect5", {
                    type: "geojson",
                    data: res["data"]

                });
                map.current.addLayer(
                    {
                        'id': "intersect5",
                        'type': "fill",
                        'source': "intersect5",
                        'paint': {
                            'fill-color': '#ffff1a',
                            'fill-opacity': 0.6,
                            'fill-outline-color': '#ffff00'

                        }
                    },

                );

                console.log("Donee");

            });;




            }

             if (map.current.getLayer('streets-data') && map.current.getLayer('flood') ) {
                           console.log("Intersection");
        var canvas = map.current.getCanvas();
        var w = canvas.width;
        var h = canvas.height;
        var cUL = map.current.unproject([0, 0]).toArray();
        var cUR = map.current.unproject([w, 0]).toArray();
        var cLR = map.current.unproject([w, h]).toArray();
        var cLL = map.current.unproject([0, h]).toArray();


        var coordinates = [cUL, cUR, cLR, cLL];

        axios.post("/intersect", {
            name: "intersect",
            coordinates: coordinates
        }, {

            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            console.log("Returned Result")
            console.log(res)
            if (map.current.getLayer('intersect')) {
                map.current.removeLayer('intersect');
                map.current.removeSource('intersect');
            }


            map.current.addSource("intersect", {
                type: "geojson",
                data: res["data"]

            });
            map.current.addLayer(
                {
                    'id': "intersect",
                    'type': "fill",
                    'source': "intersect",
                    'paint': {
                        'fill-color': '#ff3333',
                        'fill-opacity': 0.6,
                        'fill-outline-color': '#ff0000'

                    }

                }

            );
            console.log("Donee")
        });


            }

        
        }

    }


     const setIntersect4 = () => {



        if (map.current.getLayer('streets-data')) {

            var canvas = map.current.getCanvas();
            var w = canvas.width;
            var h = canvas.height;
            var cUL = map.current.unproject([0, 0]).toArray();
            var cUR = map.current.unproject([w, 0]).toArray();
            var cLR = map.current.unproject([w, h]).toArray();
            var cLL = map.current.unproject([0, h]).toArray();

            var coordinates = [cUL, cUR, cLR, cLL];

            axios.post("/intersect4", {
                name: "intersect4",
                coordinates: coordinates
            }, {

                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => {
                console.log("Returned Result")
                console.log(res)

                if (map.current.getLayer('intersect4')) {
                    map.current.removeLayer('intersect4');
                    map.current.removeSource('intersect4');
                }

                map.current.addSource("intersect4", {
                    type: "geojson",
                    data: res["data"]

                });
                map.current.addLayer(
                    {
                        'id': "intersect4",
                        'type': "fill",
                        'source': "intersect4",
                        'paint': {
                            'fill-color': '#ff3333',
                            'fill-opacity': 0.6,
                            'fill-outline-color': '#ff0000'

                        }
                    },

                );

                console.log("Donee");

            });;

        }
    

            if(map.current.getLayer('detect')){

                 axios.post("/intersect5", {
                name: "intersect5",
                coordinates: "Success"
            }, {

                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => {
                console.log("Returned Result")
                console.log(res)

                if (map.current.getLayer('intersect5')) {
                    map.current.removeLayer('intersect5');
                    map.current.removeSource('intersect5');
                }

                map.current.addSource("intersect5", {
                    type: "geojson",
                    data: res["data"]

                });
                map.current.addLayer(
                    {
                        'id': "intersect5",
                        'type': "fill",
                        'source': "intersect5",
                        'paint': {
                            'fill-color': '#ffff1a',
                            'fill-opacity': 0.6,
                            'fill-outline-color': '#ffff00'

                        }
                    },

                );

                console.log("Donee");

            });;




            }



}
        
        

    



    const setFlood2 = () => {

        if(state.kf==true){
            
       setState(state => ({ ...state, kf: false }));
   }
   else{
       
     setState(state => ({ ...state, kf: true }));
   }
        if (map.current.getLayer('floodkent')) {
                map.current.removeLayer('floodkent');
                map.current.removeSource('floodkent');
            }
        else{

        axios.post("/floodkent", {
            name: "Flood",
            coordinates: "Success"
        }, {

            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            console.log("Returned Result")
            console.log(res)

            if (map.current.getLayer('floodkent')) {
                map.current.removeLayer('floodkent');
                map.current.removeSource('floodkent');
            }

            map.current.addSource("floodkent", {
                type: "geojson",
                data: res["data"]

            });
            map.current.addLayer(
                {
                    'id': "floodkent",
                    'type': "fill",
                    'source': "floodkent",
                    'paint': {
                        'fill-color': '#1ac6ff',
                        'fill-opacity': 0.6,
                        'fill-outline-color': '#0086b3'

                    }
                },

            );

            console.log("Donee");

        });
    }

    }

        const setFlood3 = () => {

            if(state.bf==true){
            
       setState(state => ({ ...state, bf: false }));
   }
   else{
       
     setState(state => ({ ...state, bf: true }));
   }

             if (map.current.getLayer('floodblks')) {
                map.current.removeLayer('floodblks');
                map.current.removeSource('floodblks');
            }
        else{

        axios.post("/floodblks", {
            name: "Flood",
            coordinates: "Success"
        }, {

            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            console.log("Returned Result")
            console.log(res)

            if (map.current.getLayer('floodblks')) {
                map.current.removeLayer('floodblks');
                map.current.removeSource('floodblks');
            }

            map.current.addSource("floodblks", {
                type: "geojson",
                data: res["data"]

            });
            map.current.addLayer(
                {
                    'id': "floodblks",
                    'type': "fill",
                    'source': "floodblks",
                    'paint': {
                        'fill-color': '#1ac6ff',
                        'fill-opacity': 0.6,
                        'fill-outline-color': '#0086b3'

                    }
                },

            );

            console.log("Donee");

        });;

    }



    }

    const setParcels = () => {

        if(state.kp==true){
            
       setState(state => ({ ...state, kp: false }));
   }
   else{
       
     setState(state => ({ ...state, kp: true }));
   }


           if (map.current.getLayer('parcels')) {
                map.current.removeLayer('parcels');
                map.current.removeSource('parcels');
            }
        else{

        axios.post("/parcels", {
            name: "Parcels",
            coordinates: "Success"
        }, {

            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            console.log("Returned Result")
            console.log(res)

            if (map.current.getLayer('parcels')) {
                map.current.removeLayer('parcels');
                map.current.removeSource('parcels');
            }

            map.current.addSource("parcels", {
                type: "geojson",
                data: res["data"]

            });
            map.current.addLayer(
                {
                    'id': "parcels",
                    'type': "fill",
                    'source': "parcels",
                    'paint': {
                        'fill-color': '#ffffff',
                        'fill-opacity': 0.5,
                      

                    }
                },

            );

            console.log("Donee");

        });;


    }


    }

   


    const setRaster = () => {
        if(state.af==true){
            
       setState(state => ({ ...state, af: false }));
   }
   else{
       
     setState(state => ({ ...state, af: true }));
   }


     if (map.current.getLayer('flood')) {
                        map.current.removeLayer('flood');
                        map.current.removeSource('flood');
                    }
        else{

        var canvas = map.current.getCanvas();
        var w = canvas.width;
        var h = canvas.height;
        var cUL = map.current.unproject([0, 0]).toArray();
        var cUR = map.current.unproject([w, 0]).toArray();
        var cLR = map.current.unproject([w, h]).toArray();
        var cLL = map.current.unproject([0, h]).toArray();

        var coordinates = [cUL, cUR, cLR, cLL];

        
      

        axios.post("/rasterdata", {
            name: "Flood",
            coordinates: coordinates
        }, {

                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(res => {
                    console.log("Returned Result")
                    console.log(res)

                    if (map.current.getLayer('flood')) {
                        map.current.removeLayer('flood');
                        map.current.removeSource('flood');
                    }

                    map.current.addSource("flood", {
                        type: "geojson",
                        data: res["data"]

                    });
                    map.current.addLayer(
                        {
                            'id': "flood",
                            'type':"fill",
                            'source': "flood",
                            
                        },

                    );
                
                    console.log("Donee");

                });;
           

       
           }

    }

    const capture = () => {

        if(state.bd==true){
            
       setState(state => ({ ...state, bd: false }));
   }
   else{
       
     setState(state => ({ ...state, bd: true }));
   }


        if (map.current.getLayer('detect')) {
                    console.log("In Here");
                    map.current.removeLayer('detect');
                    map.current.removeSource('detect');
                }
        else{

        var canvas = map.current.getCanvas();
        var w = canvas.width;
        var h = canvas.height;
        var cUL = map.current.unproject([0, 0]).toArray();
        var cUR = map.current.unproject([w, 0]).toArray();
        var cLR = map.current.unproject([w, h]).toArray();
        var cLL = map.current.unproject([0, h]).toArray();

        console.log("In Coordinates")
        let b = map.current.getBounds();
        console.log(b);
        var coordinates = [b._sw["lng"], b._ne["lat"], b._ne["lng"], b._sw["lat"]];  // [xmin,ymin,xmax,ymax]

        //var coordinates = [cUL, cUR, cLR, cLL];
        var j = { "coordinates": coordinates }
        j = JSON.stringify(j);
        const document = new Blob([j], {
            type: 'application/json'
        });
        

        var data = new FormData();
        console.log("In Capture");
        var m = map.current.getCanvas();
        m.toBlob(function (blob) {
        
            console.log(blob);
            data.append('file', blob);
            data.append('document', document);
            axios.post("/image", data, {

                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(res => {
                console.log("Returned Result")
                console.log(res)

                if (map.current.getLayer('detect')) {
                    console.log("In Here");
                    map.current.removeLayer('detect');
                    map.current.removeSource('detect');
                }

                console.log(res["data"]);
                map.current.addSource("detect", {
                    type: "geojson",
                    data: res["data"]
                   
                });
                map.current.addLayer(
                    {
                        'id': "detect",
                        'type': "fill",
                        'source': "detect",
                        'paint': {
                            'fill-color': '#ff3333',
                            'fill-opacity': 0.6,
                            'fill-outline-color': '#ff0000'

                        }
                    }

                );
                console.log("Done");
            });
        });

      } 
    };




  const setAoI = () => {
    // Clears previous bounds array from AoI Redux slice
    dispatch(aoiActions.clearBounds());

    // Helper function: Line 90
    setMapInfo();

    // Goes to the location based on user input
    map.current.flyTo({
      center: [lngField, latField],
      zoom: zoomField,
      essential: true,
    });

    // Creates a bounding box object for polygon
    var bbox = [west, south, east, north];
    // Creates a polygon for area
    var aoi = turf.bboxPolygon(bbox);
    // Gets area of polygon
    var area = turf.area(aoi);
    // Translates area to square kilometers
    var areaSqKms = area / 1000000;
    // Minimizes area to two decimal points
    var rounded_area = Math.round(areaSqKms * 100) / 100;

    // Set area in AoI Redux slice
    dispatch(aoiActions.setArea({ area: rounded_area }));

    // Sets bounds in AoI Redux Slice
    dispatch(
      aoiActions.setBounds({
        north: Math.round(north * 100) / 100,
        east: Math.round(east * 100) / 100,
        south: Math.round(south * 100) / 100,
        west: Math.round(west * 100) / 100,
      })
    );

    // Performs query for area of interest information
    getCommunityInfo();

    // Resets update variable that controls refresh button in dashboard
    dispatch(aoiActions.updateInfo({ update: false }));
  };

  /*
   * Function that retrieves community information based on the current
   * coordinates via MapBox API and then sets the objects in array
   * within the AoI Redux slice to display on Dashboard.
   */
  const getCommunityInfo = () => {
    // Clears previous community info array  from AoI Redux slice
    dispatch(aoiActions.clearCommunityInfo());

    /*
     * Query is not reading current variables as
     * number objects so had to typecast variables
     */
    var lngF = Number(lngField);
    var latF = Number(latField);

    // Retrieves information of area with current coordinates
    geocodingClient
      .reverseGeocode({
        query: [lngF, latF],
      })
      .send()
      .then((response) => {
        // Iterates through GeoJSON object of AoI information
        try {
          response.body.features.forEach((element) =>
            // Saves community information from query to AoI Redux slice
            dispatch(
              aoiActions.setCommunityInfo({
                type: element.place_type,
                label: element.place_name,
              })
            )
          );
        } catch {
          console.log("No community nearby.");
        }
      });
  };

  // Slider Updates the Area of Interest
  const moveSlider = (e, { value }) => {
    // Updates zoom field value
    setZoomField(value);
    
    // Updates Map Redux slice
    dispatch(mapInfoActions.setZoom(value));

    // Zooms in on current coordinates
    map.current.flyTo({
      center: [lngField, latField],
      zoom: value,
      essential: true,
    });
  };

const handleChange=(e)=>{



}


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
            
            <Form.Field>
              <Button color="green" type="submit" icon="arrow right" />
                      </Form.Field> 

            </Form.Group>   
                
                
          </Form>

         

        
            <ReactFloatingDropdown indexName='Layers Panel'

                    containerStyle={{left:'50px'}}
                    toggleStyle={{width: '150px'}}
                    dropdownStyle={{borderRadius: '10px'}}
                    dropdownTopBarStyle={{backgroundColor: '#232624'}}
                    
                    dropdownContentStyle={{backgroundColor:"#82807a",align:"center"}} >
                      <Tabs onChange={e=>handleChange(e)}>
    <TabList  >
      <Tab  style={{width:160}}>VECTOR LAYERS</Tab>
      <Tab style={{width:161}}  >RASTER LAYERS </Tab>
    </TabList>
                     <TabPanel >
                   <div className='menuItem'>
                    <Checkbox label="Buildings" checked={state.bl} onClick={setLayer}/>
                    </div> 
                    <div className='menuItem'>
                    <Checkbox label="Kent-Flood" checked={state.kf} onClick={setFlood2}/>
                    </div>
                    <div className='menuItem'>
                    <Checkbox label="Kent-Parcels" checked={state.kp} onClick={setParcels}/>
                    </div> 
                    <div className='menuItem'>
                      <Checkbox label="Intersection" checked={state.int} onClick={setIntersect2}/>
                    </div> 
                    <div className='menuItem'>
                   <Checkbox label="Blks-Flood" checked={state.bf} onClick={setFlood3}/>
                    </div> 
            
                    <div className='menuItem'>
                   <Checkbox label="Building Detection" checked={state.bd} onClick={capture}/>
                    </div> 

                 </TabPanel>

                   <TabPanel>
                    <div className='menuItem'>
                    <Checkbox label="Kent-Clip" checked={state.kc} onClick={setClip}/>
                    </div> 
                    <div className='menuItem'>
                    <Checkbox label="AFG- Flood" checked={state.af}  onClick={setRaster}/>
                    </div> 
                    <div className='menuItem'>
                    <Checkbox label="AFG-Clip" checked={state.ac}  onClick={setClip2}/>
                    </div> 
                    
               </TabPanel>
            </Tabs>
      </ReactFloatingDropdown>
           

   


        {/* Zoom Slider */}
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
      </div>
    </div>
  );
};

export default MapBoxBase;

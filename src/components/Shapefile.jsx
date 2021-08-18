import { useEffect, useRef } from "react";
import { useLeaflet } from "react-leaflet";
import L, { layerGroup } from "leaflet";
import shp from "shpjs";
var l = {};
var c = {};

function Shapefile({ zipUrl, flag, name }) {
    const { map } = useLeaflet();
    
    var geo;
    var letters = "0123456789ABCDEF";
    var color = '#';
    for (var i = 0; i < 6; i++)
        color += letters[(Math.floor(Math.random() * 16))];

    var myStyle = {
        "color": color,
       
    };

    console.log(color);

    if (flag) {
        //var geo = L.geoJson();

        if (!(name in l)) {
            
            //geo.addTo(map);
           
            shp(zipUrl).then(function (data) {
                console.log(data);
                if (name in c) {
                    console.log("In correct loop");
                    geo = L.geoJSON(data, {
                        style: { "color": c[name]}
                    }).addTo(map);

                }
                else {
                    geo = L.geoJSON(data, {
                        style: myStyle
                    }).addTo(map);
                    c[name] = color;
                }
                l[name] = geo;
               
                //geo.addData(data, { style: { fillColor: 'red' } });    
            });
           
           

        }
        console.log("above l");
        console.log(l);
    }
    else {
        try {


            l[name].removeFrom(map);
            delete l[name];
        } catch (e) {
            console.log("Here");
        }
    }

    return null;
}

export default Shapefile;

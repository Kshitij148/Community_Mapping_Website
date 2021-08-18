import GeoTIff, { fromUrl, fromUrls, fromArrayBuffer, fromBlob } from 'geotiff';
import React from "react";
import parseGeoraster from "georaster";
import GeoRasterLayer from "georaster-layer-for-leaflet";
import { useLeaflet } from "react-leaflet";
import L, { layerGroup } from "leaflet";

var r = {};
function App({ flag, name }) {
    const { map } = useLeaflet();
    var url_to_geotiff_file = 'https://kshitij148.github.io/10_Year_Flood_Community.tif';

    fetch(url_to_geotiff_file)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => {
            parseGeoraster(arrayBuffer).then(georaster => {
                console.log("georaster:", georaster);

                var layer = new GeoRasterLayer({
                    georaster: georaster,
                    opacity: 0.7,
                    pixelValuesToColorFn: values => values[0] === 0 ? null : `rgb(${values[0]})`
                });

                var overlays = {
                    "Flood10YearCommunity": layer
                };

                if (flag === true) {
                    if (!(name in r)) {
                        layer.addTo(map);
                        r[name] = layer;
                    }
                }
                else {
                    try {


                        r[name].removeFrom(map);
                        delete r[name];
                    } catch (e) {
                        console.log("Here");
                    }
                }



            });
        });


    return (
        <p></p>

    );

}

export default App;
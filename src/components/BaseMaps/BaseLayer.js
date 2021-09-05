import { useEffect, useRef } from "react";
import { useLeaflet } from "react-leaflet";
import L, { layerGroup } from "leaflet";
var layer_list = {};
const bing_key = "Alx0Z57lZMDbjYArKwl_YWvJ85F7x8YerS4cdc52bVkhVuMZJYKuSwVZmTIkeGEa";

const layer= function BaseLayer({ name ,command}) {
    const { map } = useLeaflet();

    if (command == "add") {

        if (!(name in layer_list)) {
            const bing = new L.BingLayer(bing_key);
            layer_list[name] = bing;
            bing.addTo(map);

        }
        else {
            layer_list[name].removeFrom(map);
            delete layer_list[name];
        }


    }


}

export default layer;
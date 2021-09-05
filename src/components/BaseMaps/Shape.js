import React from 'react';
import { Marker as LeafletMarker } from 'leaflet';
import { MapLayer } from 'react-leaflet';
import { withLeaflet } from 'react-leaflet';

class CustomMarker extends MapLayer {

    //Whatever leaflet element this function return it will be assigned to this.leafletElement property.
    createLeafletElement(props) {
        let options = this.getOptions(props);
        const el = new LeafletMarker(props.position, options);
        let layer = props.leaflet.layerContainer;
        let map = props.leaflet.map;
        return el;
    }

    updateLeafletElement(fromProps, toProps) {
        if (fromProps.someProp != toProps.someProp) {
            //Modify this.leafletElement;
        }
    }

    componentDidMount() {
        super.componentDidMount();
        let el = this.leafletElement
    }
}

export default withLeaflet(CustomMarker);
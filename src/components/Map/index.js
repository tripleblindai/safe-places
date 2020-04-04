import React, { useState, useEffect, useRef } from "react";
import ReactMapGL from "react-map-gl";
import Track from "./trackPath";
import { token } from "../../constants/mapbox";
import { connect } from "react-redux";
import { deleteTrackEntry, addSelected } from "../../actions";
import { getFilteredTrackPath } from "../../selectors";
import track from "./trackPath";
import { fromJS } from "immutable";
import Popup from "../Popup";

import defaultMapStyleJson from "./style.json";
import WebMercatorViewport from "viewport-mercator-project";
import getBounds from "./getBounds";
var defaultMapStyle = fromJS(defaultMapStyleJson);

const currentPointLayer = {
  id: "currentPointLayer",
  type: "circle",
  source: "currentpoints",
  interactive: true,
  paint: {
    "circle-color": "#0f7eff",
    "circle-radius": 7,
    "circle-stroke-width": 3,
    "circle-stroke-color": "#ffffff"
  }
};

const selectedPointLayerAccuracy = {
  id: "selectedPointLayerAccuracy",
  type: "circle",
  source: "points",
  interactive: true,
  paint: {
    "circle-color": "#0f7eff",
    "circle-radius": [
      "interpolate",
      ["exponential", 2],
      ["zoom"],
      0,
      0,
      20,
      ["*", 20, ["get", "accuracy"]]
    ],
    "circle-opacity": 0.2,
    "circle-stroke-width": 0,
    "circle-stroke-color": "#ffffff"
  },
  filter: ["in", "storeId", "5cdaca36bab5e21e9ee19344"]
};

const currentPointLayerAccuracy = {
  id: "currentPointLayerAccuracy",
  type: "circle",
  source: "currentpoints",
  interactive: true,
  paint: {
    "circle-color": "#0f7eff",
    "circle-radius": [
      "interpolate",
      ["exponential", 2],
      ["zoom"],
      0,
      0,
      20,
      ["*", 20, ["get", "accuracy"]]
    ],
    "circle-opacity": 0.2,
    "circle-stroke-width": 0,
    "circle-stroke-color": "#ffffff"
  }
};

const currentPointLayerShadow = {
  id: "currentPointLayerShadow",
  type: "circle",
  source: "currentpoints",
  interactive: true,
  paint: {
    "circle-color": "#000000",
    "circle-radius": 15,
    "circle-translate": [0, 3],
    "circle-opacity": 0.5,
    "circle-blur": 1,
    "circle-stroke-width": 0,
    "circle-stroke-color": "#ffffff"
  }
};

const pointLayer = {
  id: "pointLayer",
  type: "circle",
  source: "points",
  paint: {
    //'circle-color': '#165078',
    "circle-stroke-width": 2,
    "circle-stroke-color": "#FFFFFF",
    "circle-color": [
      "match",
      ["get", "storeId"],
      "5cdaca36bab5e21e9ee19344",
      "#fbb03b",
      /* other */ "#165078"
    ],
    "circle-radius": 5
  }
  //filter: ['in', 'storeId', '5cdaca36bab5e21e9ee19344']
};

const pointLayerShadow = {
  id: "pointLayerShadow",
  type: "circle",
  source: "points",
  interactive: true,
  paint: {
    "circle-color": "#000000",
    "circle-radius": 8,
    "circle-translate": [0, 3],
    "circle-opacity": 0.3,
    "circle-blur": 0.6,
    "circle-stroke-width": 0,
    "circle-stroke-color": "#ffffff"
  }
};

const lineLayer = {
  id: "LineString",
  type: "line",
  source: "lines",
  layout: {
    "line-join": "round",
    "line-cap": "round"
  },
  paint: {
    "line-width": 3,
    "line-opacity": 0.5,
    "line-gradient": [
      "interpolate",
      ["linear"],
      ["line-progress"],
      0,
      "#0065D9",
      1,
      "#00D9FF"
    ]
  }
};

const emptyFeature = {
  type: "geojson",
  data: {
    features: [],
    type: "FeatureCollection"
  }
};

defaultMapStyle = defaultMapStyle
  .updateIn(["layers"], arr =>
    arr.push(
      lineLayer,
      currentPointLayerAccuracy,
      selectedPointLayerAccuracy,
      pointLayerShadow,
      pointLayer,
      currentPointLayerShadow,
      currentPointLayer
      //selectedPointLayer,
      //selectedPointLayerShadow,
    )
  )
  .setIn(["sources", "currentpoints"], fromJS(emptyFeature))
  .setIn(["sources", "selectedPointLayer"], fromJS(emptyFeature))
  .setIn(["sources", "selectedPointLayerShadow"], fromJS(emptyFeature))
  .setIn(["sources", "selectedPointLayerShadow"], fromJS(emptyFeature))
  .setIn(
    ["sources", "lines"],
    fromJS({
      lineMetrics: true,
      type: "geojson",
      data: {
        features: [],
        type: "FeatureCollection"
      }
    })
  )
  .setIn(["sources", "points"], fromJS(emptyFeature));

function Map({ addSelectedTrigger, trackPath }) {
  const [mapStyle, setMapStyle] = useState(defaultMapStyle);
  const [viewport, setViewport] = useState({
    width: 400,
    height: 300,
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8
  });
  const mapRef = useRef();

  //boundsSource = historyMapData.points;

  useEffect(() => {
    //if (!trackPath) return null;
    const historyMapData = track({
      trackPath: trackPath
    });
    var zooming = {};

    if (trackPath) {
      const { points, lines } = historyMapData;

      const mapStyleUpdate = mapStyle
        .setIn(
          ["sources", "lines"],
          fromJS({ type: "geojson", lineMetrics: true, data: lines })
        )
        .setIn(
          ["sources", "points"],
          fromJS({ type: "geojson", data: points })
        );

      setMapStyle(mapStyleUpdate);
      const bounds = getBounds(points);
      const mapObject = document.getElementsByClassName("map")[0];

      if (bounds && mapObject) {
        zooming = new WebMercatorViewport({
          width: mapRef.current._width, //mapObject.offsetWidth,
          height: mapRef.current._height //mapObject.offsetHeight
        }).fitBounds(bounds, {
          padding: 50,
          offset: [0, 0]
        });
      }

      const viewportCalc = {
        ...viewport,
        ...zooming,
        transitionDuration: 500
      };

      setViewport(viewportCalc);
    }
  }, [trackPath]);

  const onMapClick = e => {
    var bbox = [
      [e.point[0] - 1, e.point[1] - 1],
      [e.point[0] + 1, e.point[1] + 1]
    ];

    var features = mapRef.current.queryRenderedFeatures(bbox, {
      layers: ["pointLayer"]
    });

    console.log("map clicked", mapRef.current, features);

    if (features.length >= 1) {
      if (features[0].layer.id === "pointLayer") {
        console.log(features[0].properties.time);
        addSelectedTrigger([features[0].properties.time]);
      }
    }
  };

  //mapStyle="mapbox://styles/mapbox/streets-v11"
  return (
    <ReactMapGL
      className="map"
      {...viewport}
      mapboxApiAccessToken={token()}
      mapStyle={mapStyle}
      ref={mapRef}
      width="100%"
      height="100vh"
      onClick={onMapClick}
      onViewportChange={viewportInternal => setViewport(viewportInternal)}
    >
      <Popup />
      <Track />
    </ReactMapGL>
  );
}

const mapStateToProps = state => {
  return {
    trackPath: getFilteredTrackPath(state)
  };
};

const mapDispatchToProps = dispatch => ({
  addSelectedTrigger: data => dispatch(addSelected(data)),
  deleteTrackEntryTrigger: data => dispatch(deleteTrackEntry(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(Map);

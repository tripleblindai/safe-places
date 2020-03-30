import React, { useState } from "react";
import ReactMapGL from "react-map-gl";
import { token } from "../../constants/mapbox";

type MapProps = {
  dimensions: { width: number; height: number };
};

//{ dimensions }: MapProps
export default function Map() {
  const [viewport, setViewport] = useState({
    width: 400,
    height: 300,
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8
  });

  return (
    <ReactMapGL
      className="map"
      {...viewport}
      mapboxApiAccessToken={token()}
      width="100%"
      height="100vh"
      onViewportChange={viewportInternal => setViewport(viewportInternal)}
    />
  );
}

//import bezierSpline from "@turf/bezier-spline";
//import { lineString } from "@turf/helpers";

import { getTrackPath } from "../../selectors";
import { deleteTrackEntry } from "../../actions";
import { connect } from "react-redux";

const track = ({ trackPath }) => {
  if (!trackPath) return null;
  const points = trackPath.map((point, index) => {
    //const selected = currentStore && point._id === currentStore.storeId ? [point.gps_lng, point.gps_lat] : [0, 0];
    return {
      type: "Feature",
      properties: {
        time: point.time,
      },
      geometry: {
        type: "Point",
        coordinates: [point[1].longitude, point[1].latitude],
      },
    };
  });

  const lines = trackPath.map((point) => {
    return [point[1].longitude, point[1].latitude];
  });

  return {
    lines: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: lines,
          },
        },
      ],
    },
    points: {
      type: "FeatureCollection",
      features: points,
    },
  };
};

export default track;

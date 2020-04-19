import mapboxgl from "mapbox-gl";

const getBounds = currentPoints => {
  if (currentPoints && Array.isArray(currentPoints.features)) {
    var bounds = new mapboxgl.LngLatBounds();
    currentPoints.features.forEach((point, index) => {
      if (
        point.geometry.coordinates &&
        point.geometry.coordinates[0] !== undefined
      ) {
        bounds.extend(point.geometry.coordinates);
      }
    });

    if (bounds._sw && bounds._ne.lng) {
      var boundsArray;

      console.log("bounds", bounds, bounds._sw.lng === bounds._ne.lng);
      if (bounds._sw.lng === bounds._ne.lng) {
        boundsArray = [
          [bounds._sw.lng + 0.01, bounds._sw.lat + 0.01],
          [bounds._ne.lng - 0.01, bounds._ne.lat - 0.01]
        ];
      } else {
        boundsArray = [
          [bounds._sw.lng, bounds._sw.lat],
          [bounds._ne.lng, bounds._ne.lat]
        ];
      }
      return boundsArray;
    }
  }
};

export default getBounds;

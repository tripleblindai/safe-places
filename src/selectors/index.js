export const getCurrentStore = (state, ownProps) =>
  state.reducer.stores.find((e) => e.client_id === ownProps.route.item);
export const getAllPositions = (state) => state.positions;
export const getAllWarnings = (state) => state.warnings;
export const getDetail = (state) => state.detail;
export const getTrack = (state) => state.reducer.tracks;
export const getFilter = (state) => state.reducer.filter;
export const getTrackPath = (state) =>
  state.reducer.tracks && state.reducer.tracks.points
    ? Object.values(state.reducer.tracks.points).sort(function (a, b) {
        return a.time - b.time;
      })
    : [];

export const getFilteredTrackPath = (state) =>
  state.reducer.tracks && state.reducer.tracks.points
    ? Object.entries(state.reducer.tracks.points)
        .sort(function (a, b) {
          return a[1].time - b[1].time;
        })
        .filter(
          (e) =>
            e[1].time >= state.reducer.filter.dates[0] &&
            e[1].time <= state.reducer.filter.dates[1]
        )
    : [];

export const getTrackStart = (state) =>
  state.reducer.tracks &&
  state.reducer.tracks.points &&
  Math.min.apply(
    Math,
    Object.values(state.reducer.tracks.points).map(function (o) {
      return o.time;
    })
  );

export const getTrackEnd = (state) =>
  state.reducer.tracks &&
  state.reducer.tracks.points &&
  Math.max.apply(
    Math,
    Object.values(state.reducer.tracks.points).map(function (o) {
      return o.time;
    })
  );

export const countTracks = (state) => state.infections.length;
export const countPositions = (state) => state.positions.length;
export const countWarnings = (state) => state.warnings.length;
export const getCase = (state) => state.caseRed;

// TODO: Clean up
export const getWarning = (state) => {
  if (state.detail.position === undefined) return null;
  return state.warnings.find((e) => {
    return (
      e.position.lat === state.detail.position.lat &&
      e.position.lng === state.detail.position.lng
    );
  });
};

export const getAllFilteredWarnings = (state) => {
  const filteredWarnings = state.warnings.filter(
    (e) => e.matches && e.matches.length >= 1
  );
  return filteredWarnings;
};

export const getSelectedTracksData = ({ reducer }) => {
  const selectedEntries =
    reducer.tracks && reducer.tracks.points && reducer.selectedTracks
      ? Object.entries(reducer.tracks.points).filter((e) => {
          return e[0] === reducer.selectedTracks[0];
        })
      : undefined;
  return selectedEntries;
};

export const getSelectedTracks = (state) => state.reducer.selectedTracks;
export const countFilteredWarnings = (state) => {
  const filteredWarnings = state.warnings.filter(
    (e) => e.matches && e.matches.length >= 1
  );
  return filteredWarnings.length;
};

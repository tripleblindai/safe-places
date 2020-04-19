export const getCurrentStore = (state, ownProps) =>
  state.stores.find((e) => e.client_id === ownProps.route.item);
export const getAllPositions = (state) => state.positions;
export const getAllWarnings = (state) => state.warnings;
export const getDetail = (state) => state.detail;
export const getTrack = (state) => state.tracks;
export const getFilter = (state) => state.filter;
export const getTrackPath = (state) =>
  state.tracks && state.tracks.points
    ? Object.values(state.tracks.points).sort(function (a, b) {
        return a.time - b.time;
      })
    : [];

export const getFilteredTrackPath = (state) =>
  state.tracks && state.tracks.points
    ? Object.entries(state.tracks.points)
        .sort(function (a, b) {
          return a[1].time - b[1].time;
        })
        .filter(
          (e) =>
            e[1].time >= state.filter.dates[0] &&
            e[1].time <= state.filter.dates[1]
        )
    : [];

export const getTrackStart = (state) =>
  state.tracks &&
  state.tracks.points &&
  Math.min.apply(
    Math,
    Object.values(state.tracks.points).map(function (o) {
      return o.time;
    })
  );

export const getTrackEnd = (state) =>
  state.tracks &&
  state.tracks.points &&
  Math.max.apply(
    Math,
    Object.values(state.tracks.points).map(function (o) {
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

export const getSelectedTracksData = ({ selectedTracks, tracks }) => {
  const selectedEntries =
    tracks && tracks.points && selectedTracks
      ? Object.entries(tracks.points).filter((e) => {
          return e[0] === selectedTracks[0];
        })
      : undefined;
  return selectedEntries;
};

export const getSelectedTracks = (state) => state.selectedTracks;
export const countFilteredWarnings = (state) => {
  const filteredWarnings = state.warnings.filter(
    (e) => e.matches && e.matches.length >= 1
  );
  return filteredWarnings.length;
};

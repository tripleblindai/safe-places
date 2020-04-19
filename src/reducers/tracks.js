import {
  ADD_TRACK,
  DELETE_TRACK_ENTRY,
  MOVE_TRACK_ENTRY,
  EDIT_TRACK_ENTRY,
  ADD_TRACK_ENTRY,
} from "../constants/ActionTypes";
import { v4 } from "uuid";

import arrayMove from "array-move";

const initialState = [];

export default function tracks(state = initialState, action) {
  switch (action.type) {
    case ADD_TRACK:
      action.data.points = {};
      action.data.concern_points.forEach((element) => {
        action.data.points[v4()] = element;
      });

      return action.data;

    case DELETE_TRACK_ENTRY:
      const concern_points = state.concern_points.filter(
        (e) => e.time !== action.data
      );
      console.log("state", concern_points);
      return { ...state, concern_points };

    case EDIT_TRACK_ENTRY:
      const newPoints = state.points;
      if (action.id !== "new") {
        newPoints[action.id] = action.data;
      } else {
        newPoints[v4()] = action.data;
      }

      return { ...state, points: newPoints };

    case MOVE_TRACK_ENTRY:
      const findIndex = state.findIndex((e) => e.time !== action.time);
      const points = arrayMove(
        state.concern_points,
        findIndex,
        findIndex + action.difference
      );
      return { ...state, concern_points: points };

    case ADD_TRACK_ENTRY:
      let pointsAdd = state.concern_points;
      pointsAdd.push({ latitude: 0, longitude: 0, time: 2132321 });
      return { ...state, concern_points: pointsAdd };

    default:
      return state;
  }
}

export const editTrackEntry = (data, id) => {
  return {
    type: EDIT_TRACK_ENTRY,
    data,
    id,
  };
};

export const deleteTrackEntry = (data) => {
  return {
    type: DELETE_TRACK_ENTRY,
    data,
  };
};

export const addTrackEntry = (data) => {
  return {
    type: ADD_TRACK_ENTRY,
    data,
  };
};

export const addTrack = (data) => {
  return {
    type: ADD_TRACK,
    data,
  };
};

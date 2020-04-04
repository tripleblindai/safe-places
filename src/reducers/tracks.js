import {
  ADD_TRACK,
  DELETE_TRACK_ENTRY,
  MOVE_TRACK_ENTRY,
  EDIT_TRACK_ENTRY,
  COMPLETE_WARNING,
  COMPLETE_ALL_WARNINGS,
  CLEAR_ALL,
  CLEAR_COMPLETED,
  ADD_SELECTED_ENTRY,
  ADD_TRACK_ENTRY
} from "../constants/ActionTypes";

import arrayMove from "array-move";

const initialState = [];

export default function todos(state = initialState, action) {
  console.log("dispatch called", action);
  switch (action.type) {
    case ADD_TRACK:
      return action.data;

    case DELETE_TRACK_ENTRY:
      const concern_points = state.concern_points.filter(
        e => e.time !== action.data
      );
      console.log("state", concern_points);
      return { ...state, concern_points };

    case EDIT_TRACK_ENTRY:
      const newPoints = state.concern_points;
      const editPoint = newPoints.findIndex(
        e => e.time === action.initialData.time
      );

      console.log("state", state, action, editPoint);
      newPoints[editPoint] = action.data;
      return { ...state, concern_points: newPoints };

    case MOVE_TRACK_ENTRY:
      const findIndex = state.findIndex(e => e.time !== action.time);
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

    /* case EDIT_WARNING:
      return state.map(todo =>
        todo.id === action.id ? { ...todo, text: action.text } : todo
      );

    case COMPLETE_WARNING:
      return state.map(todo =>
        todo.id === action.id ? { ...todo, completed: !todo.completed } : todo
      );

    case COMPLETE_ALL_WARNINGS:
      const areAllMarked = state.every(todo => todo.completed);
      return state.map(todo => ({
        ...todo,
        completed: !areAllMarked
      }));

    case CLEAR_COMPLETED:
      return state.filter(todo => todo.completed === false);

    case CLEAR_ALL:
      return initialState;*/

    default:
      return state;
  }
}

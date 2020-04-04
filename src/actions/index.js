import * as types from "../constants/ActionTypes";

export const addLocation = data => ({ type: types.ADD_LOCATION, data });
export const deleteTodo = id => ({ type: types.DELETE_TODO, id });
export const editTodo = (id, text) => ({ type: types.EDIT_TODO, id, text });
export const completeTodo = id => ({ type: types.COMPLETE_TODO, id });
export const completeAllTodos = () => ({ type: types.COMPLETE_ALL_TODOS });
export const clearAll = () => ({ type: types.CLEAR_ALL });
export const setVisibilityFilter = filter => ({
  type: types.SET_VISIBILITY_FILTER,
  filter
});

export const addTrack = data => {
  return {
    type: types.ADD_TRACK,
    data
  };
};

export const addSelected = data => {
  console.log("addSelected");
  return {
    type: types.ADD_SELECTED_ENTRY,
    data
  };
};

export const addTrackEntry = data => {
  return {
    type: types.ADD_TRACK_ENTRY,
    data
  };
};

export const updateFilter = data => {
  return {
    type: types.UPDATE_FILTER,
    data
  };
};

export const editTrackEntry = (data, initialData) => {
  return {
    type: types.EDIT_TRACK_ENTRY,
    data,
    initialData
  };
};

export const deleteTrackEntry = data => {
  return {
    type: types.DELETE_TRACK_ENTRY,
    data
  };
};

export const downloadCase = data => {
  return {
    type: types.API_CALL_CASE_REQUEST,
    data
  };
};

export const reportCase = data => ({
  type: types.API_CALL_REPORT_REQUEST,
  data
});

export const generateWarnings = data => ({
  type: types.GENERATE_WARNINGS,
  data
});

export const generateFakeInfections = data => ({
  type: types.GENERATE_FAKE_INFECTIONS,
  data
});

export const setDetail = id => ({
  type: types.SET_DETAIL,
  id
});

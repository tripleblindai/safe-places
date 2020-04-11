import { SET_DETAIL } from "../constants/ActionTypes";

const initialState = [];

export default function detail(state = initialState, action) {
  switch (action.type) {
    case SET_DETAIL:
      return action.data;
    default:
      return state;
  }
}

export const setDetail = (data) => ({ type: SET_DETAIL, data });

export const getDetail = (state) => state.detail;

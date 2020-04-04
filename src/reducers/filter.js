import { SET_DETAIL, UPDATE_FILTER } from "../constants/ActionTypes";

const initialState = [];

export default function detail(state = initialState, action) {
  switch (action.type) {
    case UPDATE_FILTER:
      return action.data;
    default:
      return state;
  }
}

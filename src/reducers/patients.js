import { v4 } from "uuid";
export const ADD_PATIENT = "patients/add";

export default function tracks(state = {}, action) {
  switch (action.type) {
    case ADD_PATIENT:
      state[v4()] = action.data;
      return state;
    default:
      return state;
  }
}

export const addPatient = (data) => {
  return {
    type: ADD_PATIENT,
    data,
  };
};

export const showPatients = (state) => state.patients;

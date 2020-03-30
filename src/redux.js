import moment from "moment";

// reducer with initial state
const initialState = {
  currentDevice: ["5b7d572c2ff46c345cb23c44"],
  questions: {
    1: { question: "Was hat 1945 mit mir zu tun?" },
    2: { question: "Welche Frage traue ich mich eigentlich nicht zu stellen?" },
    3: { question: "Mir wurde erzählt, dass 1945 in Brandenburg ..." },
    4: { question: "Mich bewegt gerade…?" }
  },
  responses: [],
  fetching: false,
  error: null
};

export function reducer(state = initialState, action) {
  switch (action.type) {
    case "SAVE_DRAW":
      const newResponses = state.responses;
      newResponses.push(action.data);
      return { ...state, resonses: newResponses };
    default:
      return state;
  }
}

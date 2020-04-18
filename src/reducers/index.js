import { combineReducers } from "redux";

import detail from "./detail";
import positions from "./positions";
import warnings from "./warnings";
import selectedTracks from "./selectedTracks";
import filter from "./filter";
import tracks from "./tracks";
import report from "./report";
import caseRed from "./case";

const rootReducer = combineReducers({
  caseRed,
  detail,
  positions,
  warnings,
  filter,
  tracks,
  selectedTracks,
  report,
});

export default rootReducer;

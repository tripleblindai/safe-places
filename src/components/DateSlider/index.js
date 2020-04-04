import React, { useState, useEffect } from "react";
import { Range } from "rc-slider";
import moment from "moment";
import { connect, useDispatch, useSelector } from "react-redux";
import { getTrackStart, getTrackEnd, getFilter } from "../../selectors";
import styles from "./styles.module.scss";
import { updateFilter } from "../../actions";

function DateSlider({ trackStart, trackEnd }) {
  const filter = useSelector(state => getFilter(state));
  const dispatch = useDispatch();
  const steps = 30;
  useEffect(() => {
    dispatch(updateFilter([trackStart, trackEnd]));
  }, [trackStart, trackEnd]);

  const handleChange = value => {
    dispatch(updateFilter(value));
  };

  return (
    <div class="wfp--form-item" style={{ width: "100%" }}>
      <label class="wfp--label">
        {moment.utc(filter ? filter[0] : trackStart).format("YYYY-MM-DD HH:mm")}{" "}
        - {moment.utc(filter ? filter[1] : trackEnd).format("YYYY-MM-DD HH:mm")}
      </label>

      <Range
        min={trackStart}
        max={trackEnd}
        steps={steps}
        value={filter}
        onChange={handleChange}
      />
    </div>
  );
}

const mapStateToProps = state => {
  return {
    trackStart: getTrackStart(state),
    trackEnd: getTrackEnd(state)
  };
};

const mapDispatchToProps = dispatch => ({
  //addTrackEntryTrigger: data => dispatch(addTrackEntry(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(DateSlider);

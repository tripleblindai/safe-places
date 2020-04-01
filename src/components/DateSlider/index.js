import React, { useState } from "react";
import { Range } from "rc-slider";
import moment from "moment";
import { connect } from "react-redux";
import { getTrackStart, getTrackEnd } from "../../selectors";
import styles from "./styles.module.scss";

function DateSlider({ trackStart, trackEnd }) {
  //const value = Math.round(trackStart);
  //const valueb = Math.round(trackEnd);

  const [value, setValue] = useState([trackStart, trackEnd]);

  const steps = 30; // Math.round(max - min);

  const handleChange = value => {
    //const { onChange } = this.props;
    setValue(value);
  };

  return (
    <div class="wfp--form-item" style={{ width: "100%" }}>
      <label class="wfp--label">
        Zeitraum {trackStart} {trackEnd}
      </label>
      <Range
        min={trackStart}
        max={trackEnd}
        steps={steps}
        value={value}
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

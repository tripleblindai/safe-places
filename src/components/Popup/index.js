import React from "react";
import { connect } from "react-redux";
import { Popup } from "react-map-gl";
import styles from "./styles.module.scss";

import moment from "moment";
import { addSelected } from "../../actions";
import { getSelectedTracksData } from "../../selectors";

const PopupWrapper = ({ addSelectedTrigger, selectedTracksData }) => {
  if (selectedTracksData && selectedTracksData.length === 1) {
    return (
      <Popup
        tipSize={8}
        anchor="bottom"
        longitude={selectedTracksData[0].longitude}
        latitude={selectedTracksData[0].latitude}
        closeOnClick={false}
        closeButton={false}
        offsetTop={-10}
        onClose={() => addSelectedTrigger([])}
      >
        <div className={styles.popup}>
          <h3 className={styles.title}>
            {moment.utc(selectedTracksData[0].time).format("YYYY-MM-DD")}
          </h3>
          <p className={styles.time}>
            {moment.utc(selectedTracksData[0].time).format("HH:mm:ss")}
          </p>
        </div>
      </Popup>
    );
  }

  return null;
};

const mapStateToProps = state => {
  return {
    selectedTracksData: getSelectedTracksData(state)
  };
};

const mapDispatchToProps = dispatch => ({
  addSelectedTrigger: data => dispatch(addSelected(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(PopupWrapper);

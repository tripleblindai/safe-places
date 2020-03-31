import React from "react";
import { connect } from "react-redux";
import { deleteTrackEntry, addSelected } from "../../actions";
import { getTrack, getSelectedTracks } from "../../selectors";
import { Button, List, ListItem } from "@wfp/ui";
import styles from "./styles.module.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/pro-solid-svg-icons";
import moment from "moment";

function SidebarContent({
  addSelectedTrigger,
  deleteTrackEntryTrigger,
  selectedTracks,
  track
}) {
  return (
    <div>
      {/* Loaded: {JSON.stringify(track)} */}
      {track.concern_points &&
        track.concern_points.map((e, i) => (
          <div
            className={`${styles.item} ${selectedTracks.includes(e.time) &&
              styles.selectedItem}`}
            key={i}
            onClick={() => addSelectedTrigger([e.time])}
          >
            <div>
              <h3 className={styles.title}>
                {moment.utc(e.time).format("YYYY-MM-DD")}
                <span className={styles.time}>
                  {moment.utc(e.time).format("HH:mm:ss")}
                </span>
              </h3>

              <List kind="simple" colon small>
                <ListItem title="Latitude">{e.latitude}</ListItem>
                <ListItem title="Longitude">{e.longitude}</ListItem>
              </List>
            </div>
            <Button
              kind="secondary"
              icon={<FontAwesomeIcon icon={faTrashAlt} size="2x" />}
              onClick={() => deleteTrackEntryTrigger(e.time)}
            ></Button>
          </div>
        ))}
    </div>
  );
}

const mapStateToProps = state => {
  return {
    selectedTracks: getSelectedTracks(state),
    track: getTrack(state)
  };
};

const mapDispatchToProps = dispatch => ({
  addSelectedTrigger: data => dispatch(addSelected(data)),
  deleteTrackEntryTrigger: data => dispatch(deleteTrackEntry(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(SidebarContent);

import React from "react";
import { connect } from "react-redux";
import { getTrack } from "../../selectors";
import { addTrack, deleteTrackEntry } from "../../actions";
import { Button, List, ListItem } from "@wfp/ui";
import styles from "./styles.module.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCorn,
  faRaindrops,
  faCookie,
  faQuestion,
  faUserFriends,
  faTrash,
  faTrashAlt
} from "@fortawesome/pro-solid-svg-icons";
import moment from "moment";

function SidebarContent({ deleteTrackEntryTrigger, track }) {
  return (
    <div>
      {/* Loaded: {JSON.stringify(track)} */}
      {track.concern_points &&
        track.concern_points.map(e => (
          <div className={styles.item}>
            <div>
              <h3 className={styles.title}>
                {moment.utc(e.time).format("YYYY-MM-DD")}
                <span className={styles.time}>
                  {moment.utc(e.time).format("HH:mm:ss")}
                </span>
              </h3>

              <List kind="simple" small>
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
    track: getTrack(state)
  };
};

const mapDispatchToProps = dispatch => ({
  deleteTrackEntryTrigger: data => dispatch(deleteTrackEntry(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(SidebarContent);

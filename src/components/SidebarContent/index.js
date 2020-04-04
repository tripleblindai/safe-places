import React, { useState } from "react";
import { connect, useSelector, useDispatch } from "react-redux";
import {
  addTrackEntry,
  editTrackEntry,
  deleteTrackEntry,
  addSelected
} from "../../actions";
import {
  getTrack,
  getSelectedTracks,
  getFilteredTrackPath
} from "../../selectors";
import { Button, List, ListItem } from "@wfp/ui";
import styles from "./styles.module.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashAlt,
  faMapMarkerQuestion,
  faEdit
} from "@fortawesome/pro-solid-svg-icons";
import moment from "moment";
import Empty from "../Empty";
import EntryForm from "../EntryForm";
import { CounterComponent } from "../../selectors/indexNew";
import { NavLink } from "react-router-dom";

export default function SidebarContent() {
  const [open, setOpen] = useState(false);

  const selectedTracks = useSelector(state => getSelectedTracks(state));
  const filteredTrackPath = useSelector(state => getFilteredTrackPath(state));

  const dispatch = useDispatch();
  const addTrackEntryTrigger = data => dispatch(addTrackEntry(data));
  const editTrackEntryTrigger = data => dispatch(editTrackEntry(data));
  const addSelectedTrigger = data => dispatch(addSelected(data));
  const deleteTrackEntryTrigger = data => dispatch(deleteTrackEntry(data));

  const stringStore = CounterComponent();
  return (
    <>
      {!filteredTrackPath && (
        <Empty
          title="No file opened"
          className="attendance-detail-empt"
          kind="large"
          icon={<FontAwesomeIcon icon={faMapMarkerQuestion} size="1x" />}
        >
          Please open a file
        </Empty>
      )}
      {/* Loaded: {JSON.stringify(track)} */}
      {filteredTrackPath &&
        filteredTrackPath.map((e, i) => (
          <div
            className={`${styles.item} ${selectedTracks.includes(e.time) &&
              styles.selectedItem}`}
            key={i}
            onClick={() => addSelectedTrigger([e.time])}
          >
            <div className={styles.itemInner}>
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

              <div className={styles.buttons}>
                <NavLink to="?edit=true">
                  <Button
                    kind="primary"
                    icon={<FontAwesomeIcon icon={faEdit} />}
                    onClick={() => setOpen(e)}
                  ></Button>
                </NavLink>
                <Button
                  kind="primary"
                  icon={<FontAwesomeIcon icon={faTrashAlt} />}
                  onClick={() => deleteTrackEntryTrigger(e.time)}
                ></Button>
              </div>
            </div>
          </div>
        ))}
    </>
  );
}

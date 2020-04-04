import React, { useState } from "react";
import { Button } from "@wfp/ui";
import Dropzone from "./Dropzone";
import SidebarContent from "../SidebarContent";
import FileSaver, { saveAs } from "file-saver";

import { getTrack, getSelectedTracks } from "../../selectors";
import styles from "./styles.module.scss";
import { connect } from "react-redux";
import DateSlider from "../DateSlider";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSave,
  faArrowAltToBottom,
  faPlusCircle
} from "@fortawesome/pro-solid-svg-icons";
import { addTrackEntry } from "../../actions";
import EntryForm from "../EntryForm";
import { NavLink } from "react-router-dom";

function Sidebar({ addTrackEntryTrigger, track }) {
  const [openNewEntry, setOpenNewEntry] = useState(false);
  const save = () => {
    var blob = new Blob([JSON.stringify(track)], {
      type: "text/plain;charset=utf-8"
    });
    FileSaver.saveAs(blob, `export-${track.publish_date_utl}.txt`);
  };
  return (
    <>
      <div className={styles.header}>
        <div className={styles.title}>
          {track.authority_name ? (
            <>
              <h2>
                <a href={track.info_website}>{track.authority_name}</a>
              </h2>
              <p>
                {moment
                  .utc(track.publish_date_utl)
                  .format("YYYY-MM-DD HH:mm:ss")}
              </p>
            </>
          ) : (
            <>
              <h2>Open a file</h2>
              <p>No file opened</p>
            </>
          )}
        </div>
        <div className={styles.buttons}>
          <Dropzone />
          <Button
            onClick={save}
            iconReverse
            icon={<FontAwesomeIcon icon={faSave} />}
          >
            Save
          </Button>
        </div>
      </div>
      <div className={styles.filter}>
        <DateSlider />
      </div>
      <div className={styles.toolbar}>
        <NavLink to="/?edit=true">
          <Button
            kind="secondary"
            icon={<FontAwesomeIcon icon={faPlusCircle} />}
          >
            Add Entry
          </Button>
        </NavLink>
      </div>
      {openNewEntry && (
        <div className={styles.newForm}>
          <EntryForm />
        </div>
      )}
      <div className={styles.sidebarContent}>
        <SidebarContent />
      </div>
    </>
  );
}

const mapStateToProps = state => {
  return {
    selectedTracks: getSelectedTracks(state),
    track: getTrack(state)
  };
};

const mapDispatchToProps = dispatch => ({
  addTrackEntryTrigger: data => dispatch(addTrackEntry(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);

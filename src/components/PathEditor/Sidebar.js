import React, { useState } from "react";
import { Button, tooltipStyle, tooltipStyleDark } from "@wfp/ui";
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
  faCaretDown,
  faPlusCircle,
} from "@fortawesome/pro-solid-svg-icons";
import { addTrackEntry } from "../../reducers/tracks";
import EntryForm from "../EntryForm";
import SelectCase from "../SelectCase";
import { NavLink } from "react-router-dom";
import Tippy from "@tippy.js/react";

function Sidebar({ addTrackEntryTrigger, track }) {
  const [openNewEntry, setOpenNewEntry] = useState(false);
  const save = () => {
    var blob = new Blob([JSON.stringify(track)], {
      type: "text/plain;charset=utf-8",
    });
    FileSaver.saveAs(blob, `export-${track.publish_date_utl}.json`);
  };
  return (
    <>
      <div className={styles.folder}>
        <div>
          <h2 className={styles.folderTitle}>Sample organization local data</h2>
          <p className={styles.folderSubTitle}>Data for lorem ipsum</p>
        </div>
        <div className={styles.folderButtons}>
          <div>
            <Tippy
              interactive
              content={
                <div>
                  <Dropzone />
                  <Button
                    onClick={save}
                    iconReverse
                    icon={<FontAwesomeIcon icon={faSave} />}
                  >
                    Save
                  </Button>
                </div>
              }
              trigger="click"
              {...tooltipStyle}
            >
              <div>
                <Button
                  kind="secondary"
                  icon={<FontAwesomeIcon icon={faCaretDown} />}
                >
                  Actions
                </Button>
              </div>
            </Tippy>
          </div>
        </div>
      </div>
      {/*<div className={styles.selectCase}>
        <SelectCase />
            </div>*/}
      <div className={styles.header}>
        <div className={styles.title}>
          {track.authority_name ? (
            <>
              {/*}h2>
                <a href={track.info_website}>{track.authority_name}</a>
          </h2>*/}
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
          <NavLink to="/edit/new">
            <Button
              kind="secondary"
              iconReverse
              icon={<FontAwesomeIcon icon={faPlusCircle} />}
            >
              Add Entry
            </Button>
          </NavLink>
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
      {/*<div className={styles.toolbar}>
        <NavLink to="/?edit=new">
          <Button
            kind="secondary"
            icon={<FontAwesomeIcon icon={faPlusCircle} />}
          >
            Add Entry
          </Button>
          </NavLink>
      </div>*/}
      <div></div>
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

const mapStateToProps = (state) => {
  return {
    selectedTracks: getSelectedTracks(state),
    track: getTrack(state),
  };
};

const mapDispatchToProps = (dispatch) => ({
  addTrackEntryTrigger: (data) => dispatch(addTrackEntry(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);

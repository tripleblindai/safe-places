import React from "react";
import { Button } from "@wfp/ui";
import Dropzone from "./Dropzone";
import SidebarContent from "../SidebarContent";
import FileSaver, { saveAs } from "file-saver";

import { getTrack } from "../../selectors";
import styles from "./styles.module.scss";
import { connect } from "react-redux";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/pro-solid-svg-icons";

function Sidebar({ track }) {
  const save = () => {
    var blob = new Blob([JSON.stringify(track)], {
      type: "text/plain;charset=utf-8"
    });
    FileSaver.saveAs(blob, `export-${track.publish_date_utl}.txt`);
  };
  return (
    <div className={styles.sidebar}>
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
        <Dropzone />
        <Button
          onClick={save}
          iconReverse
          icon={<FontAwesomeIcon icon={faSave} />}
        >
          Save
        </Button>
      </div>
      <SidebarContent />
    </div>
  );
}

const mapStateToProps = state => {
  return {
    track: getTrack(state)
  };
};

export default connect(mapStateToProps)(Sidebar);

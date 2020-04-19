import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { addTrack, generateWarnings } from "../../reducers/tracks";
//import { getAllTracks } from "../../selectors";
import { connect } from "react-redux";
import { Button } from "@wfp/ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderPlus } from "@fortawesome/pro-solid-svg-icons";

function MyDropzone({ addTrackTrigger }) {
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        // Do whatever you want with the file contents
        const binaryStr = reader.result;
        addTrackTrigger(JSON.parse(binaryStr));
        console.log(JSON.parse(binaryStr));
      };
      reader.readAsText(file);
    });
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <Button iconReverse icon={<FontAwesomeIcon icon={faFolderPlus} />}>
        Load
      </Button>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    // track: getAllTracks(state)
  };
};

const mapDispatchToProps = (dispatch) => ({
  addTrackTrigger: (data) => dispatch(addTrack(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyDropzone);

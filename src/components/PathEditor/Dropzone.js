import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { addTrack, generateWarnings } from "../../actions";
import { getAllTracks } from "../../selectors";
import { connect } from "react-redux";

function MyDropzone({ addTrackTrigger }) {
  const onDrop = useCallback(acceptedFiles => {
    acceptedFiles.forEach(file => {
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
      <p>Drag 'n' drop some files here, or click to select files</p>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    track: getAllTracks(state)
  };
};

const mapDispatchToProps = dispatch => ({
  addTrackTrigger: data => dispatch(addTrack(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(MyDropzone);

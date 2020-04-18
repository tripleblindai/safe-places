import React from "react";
import Map from "../Map";
import Sidebar from "./Sidebar";
import Wrapper from "../Wrapper";
import EntryForm from "../EntryForm";
import { getSelectedTracksData } from "../../selectors";
import { useSelector } from "react-redux";

export default function PathEditor() {
  const selectedTracksData = useSelector((state) =>
    getSelectedTracksData(state)
  );
  return (
    <Wrapper
      editor={
        <EntryForm
          initialData={selectedTracksData && selectedTracksData[0][1]}
        />
      }
      sidebar={<Sidebar />}
    >
      <Map />
    </Wrapper>
  );
}

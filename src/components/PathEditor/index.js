import React, { useRef, useState, useLayoutEffect } from "react";
import Map from "../Map";
import Sidebar from "./Sidebar";
import Wrapper from "../Wrapper";
import EntryForm from "../EntryForm";

export default function PathEditor() {
  return (
    <Wrapper editor={<EntryForm />} sidebar={<Sidebar />}>
      <Map />
    </Wrapper>
  );
}

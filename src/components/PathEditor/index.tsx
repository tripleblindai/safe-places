import React, { useRef, useState, useLayoutEffect } from "react";
import Map from "../Map";
import Sidebar from "./Sidebar";
import Wrapper from "../Wrapper";

export default function PathEditor() {
  /* const targetRef = useRef<HTMLDivElement>();
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0
  });
  useLayoutEffect(() => {
    if (targetRef.current) {
      setDimensions({
        width: targetRef?.current?.offsetWidth,
        height: targetRef?.current?.offsetHeight
      });
    }
  }, []);*/

  return (
    <Wrapper sidebar={<Sidebar />}>
      <Map />
    </Wrapper>
  );
}

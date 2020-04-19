import React from "react";
import { TextInput } from "@wfp/ui";
export default function FakeTextInput(props) {
  console.log("new Props", props);
  const { min, max, time } = props;
  return <input {...props} />;
  //return <TextInput {...props} value={props.value ? "" : "waaaa"} />;
}

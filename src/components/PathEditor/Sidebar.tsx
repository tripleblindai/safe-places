import React from "react";
import { Button } from "@wfp/ui";
import Dropzone from "./Dropzone";

export default function Sidebar() {
  return (
    <div>
      <Dropzone />
      <Button>Load</Button>
      <Button>Save</Button>
    </div>
  );
}

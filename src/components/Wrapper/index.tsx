import React, { useRef, useState, useLayoutEffect } from "react";
import styles from "./styles.module.scss";
import { useLocation } from "react-router";

type AppProps = { children: any; editor: any; sidebar: any };

export default function Wrapper({ children, editor, sidebar }: AppProps) {
  const location = useLocation();

  return (
    <div
      className={`${styles.wrapper} ${
        location.search.includes("edit") ? styles.wrapperEdit : ""
      }`}
    >
      <div className={styles.sidebar}>{sidebar}</div>
      <div className={styles.editor}>{editor}</div>
      <div className={styles.content}>{children}</div>
    </div>
  );
}

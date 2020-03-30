import React, { useRef, useState, useLayoutEffect } from "react";
import styles from "./style.module.scss";

type AppProps = { children: any; sidebar: any };

export default function Wrapper({ children, sidebar }: AppProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.sidebar}>{sidebar}</div>
      <div className={styles.content}>{children}</div>
    </div>
  );
}

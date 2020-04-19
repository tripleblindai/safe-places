import React from "react";
import styles from "./styles.module.scss";
import { useParams } from "react-router";

//type AppProps = { children: any; editor: any; sidebar: any };

export default function Wrapper({ children, editor, sidebar }) {
  const params = useParams();
  return (
    <div
      className={`${styles.wrapper} ${
        params.page === "edit" ? styles.wrapperEdit : ""
      }`}
    >
      <div className={styles.sidebar}>{sidebar}</div>
      <div className={styles.editor}>{editor}</div>
      <div className={styles.content}>{children}</div>
    </div>
  );
}

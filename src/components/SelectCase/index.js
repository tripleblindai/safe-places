import React from "react";
import Select from "react-select";
import styles from "./styles.module.scss";

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

export default function SelectCase() {
  return <Select className={styles.select} options={options} />;
}

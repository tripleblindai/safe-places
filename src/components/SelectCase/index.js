import React from "react";
import Select, { components } from "react-select";
import styles from "./styles.module.scss";

const options = [
  { value: "chocolate", label: "Journey of user xy" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

const SingleValue = ({ children, ...props }) => (
  <components.SingleValue {...props}>
    <h2 className={styles.title}>{children}</h2>
    <p className={styles.subTitle}>2020-04-11 23:03:25</p>
  </components.SingleValue>
);

const customStyles = {
  control: (base) => ({
    ...base,
    height: 50,
    minHeight: 50,
  }),
};

export default function SelectCase() {
  return (
    <Select
      className={styles.select}
      options={options}
      styles={customStyles}
      components={{ SingleValue }}
    />
  );
}

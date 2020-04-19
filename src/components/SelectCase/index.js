import React from "react";
import Select, { components } from "react-select";
import styles from "./styles.module.scss";
import { showPatients } from "../../reducers/patients";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

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
  const patients = useSelector((state) => showPatients(state));
  const history = useHistory();

  const options = Object.entries(patients).map((e) => {
    return { value: e[0], label: e[0] };
  });

  options.push({ value: "all", label: "all cases" });
  return (
    <Select
      className={styles.select}
      options={options}
      styles={customStyles}
      components={{ SingleValue }}
      onChange={(e) => history.push(`/${e.value}`)}
    />
  );
}

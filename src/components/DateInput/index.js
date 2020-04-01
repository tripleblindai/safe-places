import React from "react";
import { TextInput } from "@wfp/ui";
import styles from "./styles.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faClock } from "@fortawesome/pro-regular-svg-icons";
import moment from "moment";

export default function DateInput(props) {
  const { min, max, time } = props;
  // Format date value
  const value = moment(props.value).format("YYYY-MM-DD");
  return (
    <TextInput
      additional={
        <div className={styles.icon}>
          <FontAwesomeIcon icon={time ? faClock : faCalendarAlt} />
        </div>
      }
      type="date"
      {...props}
      value={value}
      formItemClassName={styles.dateInput}
      max={
        max !== undefined
          ? max
          : time
          ? undefined
          : moment().format("YYYY-MM-DD")
      }
      min={
        min !== undefined
          ? min
          : time
          ? undefined
          : moment().format("YYYY-MM-DD")
      }
      placeholder=""
      defaultValue=""
    />
  );
}

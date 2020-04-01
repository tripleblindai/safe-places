import React from "react";
import { Controller, useForm } from "react-hook-form";
import { connect } from "react-redux";
import { addTrackEntry } from "../../actions";
import { getTrack, getSelectedTracks } from "../../selectors";
import { Button, TextArea, TextInput } from "@wfp/ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/pro-solid-svg-icons";
import DateInput from "../DateInput";
import styles from "./styles.module.scss";

const EntryForm = ({ addTrackEntryTrigger, initialData }) => {
  const methods = useForm({
    defaultValues: initialData
  });

  const { control, getValues, register, errors, handleSubmit } = methods;

  const onSubmit = values => {
    console.log(values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      {errors.email && errors.email.message}

      <div className={styles.dateWrapper}>
        <Controller
          as={<DateInput labelText="Delivery date" />}
          name={`date`}
          type="date"
          min={null}
          max={null}
          control={control}
        />
        <Controller
          as={<DateInput time labelText="Delivery time" type="time" />}
          name={`time`}
          defaultValue=""
          min={null}
          max={null}
          control={control}
        />
      </div>

      <div className={styles.position}>
        <Controller
          as={<TextInput labelText="Latitude" />}
          name={`latitude`}
          defaultValue=""
          control={control}
        />
        <Controller
          as={<TextInput labelText="Longitude" />}
          name={`longitude`}
          defaultValue=""
          control={control}
        />
      </div>

      <div className={styles.address}>
        <div className={styles.streetWrapper}>
          <Controller
            as={<TextInput labelText="Street" />}
            name={`street`}
            defaultValue=""
            control={control}
          />
          <Controller
            as={<TextInput labelText="other" />}
            name={`other`}
            defaultValue=""
            control={control}
          />
        </div>
        <div className={styles.townWrapper}>
          <Controller
            as={<TextInput labelText="Town" />}
            name={`town`}
            defaultValue=""
            control={control}
          />
          <Controller
            as={<TextInput labelText="Postal code" />}
            name={`postal`}
            defaultValue=""
            control={control}
          />
        </div>
      </div>
      <div className={styles.comment}>
        <Controller
          as={<TextArea labelText="Comment" />}
          name={`comment`}
          defaultValue=""
          control={control}
        />
      </div>

      <Button type="submit" onClick={() => addTrackEntryTrigger()}>
        Add to tracks
      </Button>
    </form>
  );
};

const mapStateToProps = state => {
  return {
    selectedTracks: getSelectedTracks(state),
    track: getTrack(state)
  };
};

const mapDispatchToProps = dispatch => ({
  addTrackEntryTrigger: data => dispatch(addTrackEntry(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(EntryForm);

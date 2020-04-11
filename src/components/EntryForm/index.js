import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { connect, useDispatch } from "react-redux";
import { addTrackEntry, editTrackEntry } from "../../actions";
import { getTrack, getSelectedTracks } from "../../selectors";
import { Button, TextArea, TextInput } from "@wfp/ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams, useLocation, useHistory } from "react-router";
import Geocode from "react-geocode";

import {
  faPlusCircle,
  faCrosshairs,
  faMapMarkerQuestion,
  faCross,
  faTimes,
  faLocationCircle,
} from "@fortawesome/pro-solid-svg-icons";
import DateInput from "../DateInput";
import styles from "./styles.module.scss";
import { NavLink } from "react-router-dom";
import moment from "moment";
import FakeTextInput from "../FakeTextInput";
// set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
Geocode.setApiKey(process.env.REACT_APP_GOOGLE_PLACES_KEY);

// set response language. Defaults to english.
Geocode.setLanguage("en");

// set response region. Its optional.
// A Geocoding request with region=es (Spain) will return the Spanish city.
Geocode.setRegion("es");

// Enable or disable logs. Its optional.
Geocode.enableDebug();

const EntryForm = ({ addTrackEntryTrigger, initialData }) => {
  const [load, setLoad] = useState(false);
  const methods = useForm({
    defaultValues: initialData,
  });

  const {
    control,
    errors,
    getValues,
    setValue,
    reset,
    handleSubmit,
    register,
  } = methods;

  const dispatch = useDispatch();
  let history = useHistory();

  const location = useLocation();

  useEffect(() => {
    console.log("location.search", location.search);
    var initialDataManipulated = {};
    if (!location.search.includes("new") && initialData) {
      initialDataManipulated = JSON.parse(JSON.stringify(initialData));
      initialDataManipulated.date = moment(initialDataManipulated.time).format(
        "YYYY-MM-DD"
      );
      initialDataManipulated.time = moment(initialDataManipulated.time).format(
        "hh:mm"
      );
    }

    reset(initialDataManipulated);
  }, [initialData, location.search]);

  if (!location.search.includes("edit")) {
    return null;
  }

  // Get address from latidude & longitude.
  const fromLatLng = () => {
    const values = getValues();
    Geocode.fromLatLng(values.latitude, values.longitude).then(
      (response) => {
        const search = (code) => {
          const find = components.find((e) => e.types.includes(code));
          return find ? find.long_name : "";
        };
        const components = response.results[0].address_components;
        console.log(response.results[0].address_components);
        setValue([
          {
            street: `${search("route")} ${search("street_number")}`,
          },
          {
            postal: search("postal_code"),
          },
          { town: search("locality") },
        ]);
      },
      (error) => {
        console.error(error);
      }
    );
  };

  const fromAddress = () => {
    const values = getValues();
    const address = `${values.street} ${values.other} ${values.town} ${values.postal}`;
    Geocode.fromAddress(address).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        console.log(lat, lng);

        setValue([
          {
            latitude: lat,
          },
          {
            longitude: lng,
          },
        ]);
      },

      (error) => {
        console.error(error);
      }
    );
  };

  const onSubmit = (values) => {
    console.log(values);
    values.time = moment(`${values.date} ${values.time}`).valueOf();
    values.latitude = parseFloat(values.latitude);
    values.longitude = parseFloat(values.longitude);
    dispatch(editTrackEntry(values, initialData));
    history.push("/");
  };

  if (load) return null;
  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>Edit</div>
        <NavLink to="/">
          <Button
            icon={<FontAwesomeIcon icon={faTimes} />}
            className={styles.closeButton}
          ></Button>
        </NavLink>
      </div>
      <div className={styles.dateWrapper}>
        <Controller
          as={<DateInput labelText="Date" />}
          name="date"
          type="date"
          min={null}
          max={null}
          control={control}
        />
        <Controller
          as={<DateInput time labelText="Time" type="time" />}
          name="time"
          min={null}
          max={null}
          control={control}
        />
      </div>

      <div className={styles.position}>
        <TextInput
          labelText="Latitude"
          name="latitude"
          invalidText="Invalid latitude"
          invalid={errors.longitude}
          inputRef={register({
            validate: (value) => {
              const parseValue = parseFloat(value);
              return (
                !isNaN(parseValue) && parseValue >= -90 && parseValue <= 90
              );
            },
          })}
        />
        <TextInput
          labelText="Longitude"
          name="longitude"
          invalidText="Invalid longitude"
          invalid={errors.longitude}
          inputRef={register({
            validate: (value) => {
              const parseValue = parseFloat(value);
              return (
                !isNaN(parseValue) && parseValue >= -180 && parseValue <= 180
              );
            },
          })}
        />

        <Button
          className={styles.pickButton}
          onClick={fromLatLng}
          icon={<FontAwesomeIcon icon={faCrosshairs} />}
        ></Button>
        <Button
          onClick={fromLatLng}
          icon={<FontAwesomeIcon icon={faLocationCircle} />}
        ></Button>
      </div>

      <div className={styles.address}>
        <div className={styles.streetWrapper}>
          <TextInput labelText="Street" name="street" inputRef={register} />
          <TextInput labelText="Other" name="other" inputRef={register} />
        </div>
        <div className={styles.townWrapper}>
          <TextInput labelText="Town" name="town" inputRef={register} />
          <TextInput
            labelText="Postal code"
            name="postal"
            inputRef={register}
          />
          <Button
            onClick={fromAddress}
            icon={<FontAwesomeIcon icon={faMapMarkerQuestion} />}
          ></Button>
        </div>
      </div>
      <div className={styles.commentWrapper}>
        <Controller
          as={<TextArea labelText="Comment" />}
          name="comment"
          control={control}
        />
      </div>

      <Button type="submit">{initialData ? "Update" : "Add to tracks"}</Button>
    </form>
  );
};

const mapStateToProps = (state) => {
  return {
    selectedTracks: getSelectedTracks(state),
    track: getTrack(state),
  };
};

const mapDispatchToProps = (dispatch) => ({
  addTrackEntryTrigger: (data) => dispatch(addTrackEntry(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EntryForm);

import React, { useEffect } from "react";
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
  faTimes
} from "@fortawesome/pro-solid-svg-icons";
import DateInput from "../DateInput";
import styles from "./styles.module.scss";
import { NavLink } from "react-router-dom";
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
  const methods = useForm({
    defaultValues: initialData
  });

  const { control, getValues, setValue, reset, handleSubmit } = methods;

  const dispatch = useDispatch();
  let history = useHistory();

  useEffect(() => {
    reset(initialData);
  }, [initialData]);

  const location = useLocation();

  console.log("location", location.search);
  /*if (!location.search.includes("edit")) {
    return null;
  }*/

  // Get address from latidude & longitude.
  const fromLatLng = () => {
    const values = getValues();
    Geocode.fromLatLng(values.latitude, values.longitude).then(
      response => {
        const search = code => {
          const find = components.find(e => e.types.includes(code));
          return find ? find.long_name : "";
        };
        const address = response.results[0].formatted_address;
        const components = response.results[0].address_components;
        console.log(response.results[0].address_components);
        setValue([
          {
            street: `${search("route")} ${search("street_number")}`
          },
          {
            postal: search("postal_code")
          },
          { town: search("locality") }
        ]);
      },
      error => {
        console.error(error);
      }
    );
  };

  const fromAddress = () => {
    const values = getValues();
    const address = `${values.street} ${values.other} ${values.town} ${values.postal}`;
    Geocode.fromAddress(address).then(
      response => {
        const { lat, lng } = response.results[0].geometry.location;
        console.log(lat, lng);

        setValue([
          {
            latitude: lat
          },
          {
            longitude: lng
          }
        ]);
      },

      error => {
        console.error(error);
      }
    );
  };

  const onSubmit = values => {
    console.log(values);

    dispatch(editTrackEntry(values, initialData));
    history.push("/");
  };

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
        <Controller
          as={<TextInput labelText="Latitude" />}
          name="latitude"
          control={control}
        />
        <Controller
          as={<TextInput labelText="Longitude" />}
          name="longitude"
          control={control}
        />
        <Button
          onClick={fromLatLng}
          icon={<FontAwesomeIcon icon={faCrosshairs} />}
        ></Button>
      </div>

      <div className={styles.address}>
        <div className={styles.streetWrapper}>
          <Controller
            as={<TextInput labelText="Street" />}
            name="street"
            control={control}
          />
          <Controller
            as={<TextInput labelText="other" />}
            name="other"
            control={control}
          />
        </div>
        <div className={styles.townWrapper}>
          <Controller
            as={<TextInput labelText="Town" />}
            name="town"
            control={control}
          />
          <Controller
            as={<TextInput labelText="Postal code" />}
            name="postal"
            control={control}
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
          name={`comment`}
          defaultValue=""
          control={control}
        />
      </div>

      <Button type="submit">{initialData ? "Update" : "Add to tracks"}</Button>
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

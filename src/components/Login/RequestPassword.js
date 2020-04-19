import React, { useState } from "react";
import { connect } from "react-redux";
import PageTitle from "../PageTitle";

import qs from "qs";
import axios from "axios";
import { iconWfpLogoVerticalEn } from "@wfp/icons";

import { Controller, ErrorMessage, useForm } from "react-hook-form";
import { prepareForm } from "helpers/formHelpers";

import { Blockquote, Button, TextInput, Icon, InlineLoading } from "@wfp/ui";
import styles from "./login.module.scss";
import infoIcon from "images/notebook.svg";

import { Link } from "react-router-dom";

import getEnvVars from "data-handler/environment";
import { faChevronLeft } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Empty from "components/Empty";
import { NavLink } from "react-router-dom/cjs/react-router-dom";
import InputWrapper from "components/InputWrapper";
const { apiUrl } = getEnvVars();

const RequestPassword = (props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  //props.disableLogout();
  const methods = useForm({
    defaultValues: prepareForm(),
  });

  const { control, handleSubmit, errors } = methods;

  const onSubmit = async (values) => {
    setLoading(true);
    return axios
      .post(`${apiUrl}/auth/password/reset/`, qs.stringify(values))
      .then((response) => {
        if (response.data && response.data.detail) {
          setError("Password reset e-mail has been sent.");
          setSuccess(true);
        } else {
          setLoading(false);
          setError("Unknown email or phone number. Please verify");
        }
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 400) {
            //setError("Enter a valid email or phone number");

            setError([
              {
                type: "required",
                name: "email",
                message: error.response.data.errors.email,
              },
            ]);

            //setError(error.response.data.errors);
          } else if (error.response.status === 500) {
            setError("A server error occurred");
            //setError(error.response.data.errors);f
          } else {
            setError("You are offline. Please try again when you are online.");
          }
          setLoading(false);
        }
        return null;
      });
  };

  if (success)
    return (
      <Empty
        button={
          <>
            <NavLink to={`/login`}>
              <Button kind="secondary">Login again</Button>
            </NavLink>
          </>
        }
        title="New password has been sent!"
        kind="large"
        icon={
          <img
            alt="info illustratation notebook with pen"
            src={infoIcon}
            style={{ marginLeft: "0.5rem", marginBottom: "1rem" }}
          />
        }
      >
        Please check your emails or SMS
      </Empty>
    );

  return (
    <div className={styles.login}>
      <div className={styles.loginForm}>
        <div className={styles.loginLogo}>
          <Icon icon={iconWfpLogoVerticalEn} />
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Link to="/login" className={styles.backLink}>
            <Button
              icon={<FontAwesomeIcon icon={faChevronLeft} />}
              iconReverse
              kind="secondary"
              className={styles.backLink}
            >
              Back to login
            </Button>
          </Link>
          {success && (
            <Empty
              button={
                <>
                  <NavLink to={`/login`}>
                    <Button kind="secondary">Login again</Button>
                  </NavLink>
                </>
              }
              title="New password has been sent!"
              kind="large"
              icon={
                <img
                  alt="info illustratation notebook with pen"
                  src={infoIcon}
                  style={{ marginLeft: "0.5rem", marginBottom: "1rem" }}
                />
              }
            >
              Please check your emails or SMS
            </Empty>
          )}
          {error && error._error && (
            <Blockquote warning>{error._error}</Blockquote>
          )}
          {!success && (
            <>
              <PageTitle>Request new password</PageTitle>
              <ErrorMessage errors={errors} name="email" />

              <Controller
                as={
                  <InputWrapper
                    control={control}
                    component={TextInput}
                    error={error}
                    autocorrect="off"
                    autoCapitalize="off"
                    labelText="Email or phone number"
                    id="email"
                  />
                }
                name="email"
                defaultValue=""
                control={control}
                rules={{
                  required: "Required",
                }}
              />
              <div className={styles.submitWrapper}>
                <Button type="submit">Request password</Button>
                {loading && <InlineLoading />}
              </div>
            </>
          )}
        </form>
      </div>
      <div className={styles.loginContent}>
        <h2>Resetting your password will</h2>
        <p>
          Consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut
          labore et dolore magna aliquyam erat, sed diam voluptua.
        </p>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    fetching: state.fetching,
    schools: state.schools,
    error: state.error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    disableLogout: () => dispatch({ type: "LOGOUT", data: false }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RequestPassword);

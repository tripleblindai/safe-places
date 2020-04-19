import React, { useState } from "react";
import { connect } from "react-redux";
import PageTitle from "../PageTitle";
import qs from "qs";
import Auth from "../../modules/Auth";
import axios from "axios";
import { iconWfpLogoVerticalEn } from "@wfp/icons";
import { Controller, ErrorMessage, useForm } from "react-hook-form";
import { prepareForm } from "helpers/formHelpers";
import { Blockquote, Button, TextInput, Icon, InlineLoading } from "@wfp/ui";
import styles from "./login.module.scss";

import { Link } from "react-router-dom";

import getEnvVars from "data-handler/environment";
const { apiUrl } = getEnvVars();

const Login = (props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const methods = useForm({
    defaultValues: prepareForm(),
  });

  const { control, handleSubmit, errors } = methods;

  const onSubmit = async (values) => {
    setLoading(true);
    return axios
      .post(`${apiUrl}/auth/login/`, qs.stringify(values))
      .then((response) => {
        if (response.data && response.data.token) {
          console.log("response", response, values.password);
          Auth.authenticateUser(response.data, values.password);
          setTimeout(() => {
            props.history.push("");
          }, 1000);
        } else {
          setLoading(false);
          setError("Wrong login credentials. Please check");
        }
      })
      .catch(() => {
        setLoading(false);

        setError("Wrong login credentials. Please check");
        return null;
      });
  };

  return (
    <div className={styles.login}>
      <div className={styles.loginForm}>
        <div className={styles.loginLogo}>
          <Icon icon={iconWfpLogoVerticalEn} />
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          {error && <Blockquote warning>{error}</Blockquote>}
          <PageTitle>Sign in to School Connect</PageTitle>
          <ErrorMessage errors={errors} name="email" />

          <Controller
            as={
              <TextInput
                autocorrect="off"
                autoCapitalize="off"
                labelText="Email or phone number"
                id="email"
                invalid={errors.email}
                invalidText={errors.email && errors.email.message}
              />
            }
            name="email"
            defaultValue=""
            control={control}
            rules={{
              required: "Required",
            }}
          />
          <Controller
            as={
              <TextInput
                autocorrect="off"
                autoCapitalize="off"
                id="password"
                labelText="Password"
                type="password"
              />
            }
            name="password"
            defaultValue=""
            control={control}
          />
          <div className={styles.submitWrapper}>
            <div className={styles.button}>
              <Button type="submit">Sign in</Button>
              {loading && <InlineLoading />}
            </div>
            <Link to="/requestpassword" className={styles.password}>
              Request new password
            </Link>
          </div>
        </form>
      </div>
      <div className={styles.loginContent}>
        <h2>
          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
          nonumy eirmod tempor invidunt
        </h2>
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

export default connect(mapStateToProps, mapDispatchToProps)(Login);

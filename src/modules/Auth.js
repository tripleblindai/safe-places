import React from "react";
import { Route, Redirect } from "react-router-dom";
import Store from "data-handler/store";

import { connect } from "react-redux";

export default class Auth {
  static authenticateUser = (userData, password) => {
    Store().store.dispatch({
      type: "LOGIN",
      data: userData,
      password: password,
    });
    return true;
  };

  /**
   * Check if a user is authenticated - check if a token is saved in Local Storage
   *
   * @returns {boolean}
   */
  static isUserAuthenticated = () => {
    const user = Store().store.getState().reducer.auth;
    //return true;
    return user !== undefined;
  };

  /**
   * Check if a user is authenticated - check if a token is saved in Local Storage
   *
   * @returns {boolean}
   */
  static isUserLocalAuthenticated = () => {
    const user =
      Store().store.getState().reducer.auth &&
      Store().store.getState().reducer.auth.user;
    return user;
  };

  /**
   * Deauthenticate a user. Remove a token from Local Storage.
   *
   */
  static deauthenticateUser = () => {
    Store().store.dispatch({ type: "LOGOUT" });
  };
}

export let PrivateRoute = ({ component: Component, logout, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        Auth.isUserAuthenticated() &&
        Auth.isUserLocalAuthenticated() &&
        logout !== true ? (
          <Component {...props} {...rest} />
        ) : Auth.isUserAuthenticated() &&
          !Auth.isUserLocalAuthenticated() &&
          logout !== true ? (
          <Redirect
            to={{
              pathname: "/locallogin/",
              state: { from: props.location },
            }}
          />
        ) : (
          <Redirect
            to={{
              pathname: "/login/",
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

connect(mapStateToProps)(PrivateRoute);

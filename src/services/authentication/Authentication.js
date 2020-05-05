import React, { useContext } from "react";
import PropTypes from "prop-types";

import { AuthenticationContext } from "./AuthenticationContext";
import { AuthenticationBasic } from "./AuthenticationBasic";

export const useAuth = () => useContext(AuthenticationContext);

const Authentication = ({ children, mode }) => {
  switch (mode) {
    case "basic":
      return <AuthenticationBasic>{children}</AuthenticationBasic>;
    default:
      return <h1>Authentication mode {mode} is not supported</h1>;
  }
};

Authentication.propTypes = {
  mode: PropTypes.string,
  children: PropTypes.object,
};

export default Authentication;

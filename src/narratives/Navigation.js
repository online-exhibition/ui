import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";

import { AppBar, Slide } from "@material-ui/core";

import { useAuth } from "services/authentication/Authentication";

import NavigationToolbarLoggedIn from "./NavigationToolbarLoggedIn";
import NavigationToolbar from "./NavigationToolbar";
import selectors from "redux/selectors";

/**
 * Navigation element
 * @param {object} props
 * @return {function} Navigation renderer
 */
function Navigation({ showAppBar }) {
  const history = useHistory();

  const { isAuthenticated, user, logout } = useAuth();

  const doLogout = useCallback(() => {
    logout();
    history.push("/");
  }, [logout, history]);

  return (
    <Slide in={showAppBar}>
      <AppBar position="static">
        {isAuthenticated ? (
          <NavigationToolbarLoggedIn user={user} onLogout={doLogout} />
        ) : (
          <NavigationToolbar />
        )}
      </AppBar>
    </Slide>
  );
}

Navigation.propTypes = {
  showAppBar: PropTypes.bool,
};

const mapStateToProps = (state) => {
  // Because of a problem with zombie children,
  //    useSelector doesn't work properly
  return {
    showAppBar: selectors.appbar.show(state),
  };
};

export default connect(mapStateToProps)(Navigation);

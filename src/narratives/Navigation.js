import React, {useCallback} from 'react';
import PropTypes from 'prop-types';
import {useHistory} from 'react-router-dom';
import {connect} from 'react-redux';

import {
  AppBar, Slide,
} from '@material-ui/core';

import {useAjax} from 'components/Ajax';

import NavigationToolbarLoggedIn from './NavigationToolbarLoggedIn';
import NavigationToolbar from './NavigationToolbar';
import selectors from 'redux/selectors';

/**
 * Navigation element
 * @param {object} props
 * @return {function} Navigation renderer
 */
function Navigation({showAppBar}) {
  const ajax = useAjax();
  const history = useHistory();

  const {loggedIn, user} = ajax;

  const logout = useCallback(() => {
    ajax.removeAuthorization();
    history.push('/');
  }, [ajax, history]);

  return (
    <Slide in={showAppBar}>
      <AppBar position="static">
        {loggedIn ? (
        <NavigationToolbarLoggedIn user={user} onLogout={logout} />
      ) : (
        <NavigationToolbar />
      )}
      </AppBar>
    </Slide>
  );
}

Navigation.propTypes ={
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

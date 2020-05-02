import React, {useCallback} from 'react';
import {useHistory} from 'react-router-dom';

import {
  AppBar,
} from '@material-ui/core';

import {useAjax} from 'components/Ajax';
import NavigationToolbarLoggedIn from './NavigationToolbarLoggedIn';
import NavigationToolbar from './NavigationToolbar';

/**
 * Navigation element
 * @param  {object} props
 * @return {function} Navigation renderer
 */
function Navigation(props) {
  const ajax = useAjax();
  const history = useHistory();

  const {loggedIn, user} = ajax;

  const logout = useCallback(() => {
    ajax.removeAuthorization();
    history.push('/');
  }, [ajax]);

  return (
    <AppBar position="static">
      {loggedIn ? (
        <NavigationToolbarLoggedIn user={user} onLogout={logout} />
      ) : (
        <NavigationToolbar />
      )}
    </AppBar>
  );
}

export default Navigation;

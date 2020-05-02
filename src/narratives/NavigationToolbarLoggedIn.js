import React from 'react';
import PropTypes from 'prop-types';

import {Toolbar, IconButton, Icon, Typography, Button} from '@material-ui/core';

import {useStyles} from 'styles';

const NavigationToolbarLoggedIn = ({user, onLogout}) => {
  const classes = useStyles();
  return (
    <Toolbar>
      <IconButton
        edge="start"
        className={classes.menuButton}
        color="inherit"
        aria-label="menu"
      >
        <Icon>menu</Icon>
      </IconButton>
      <Typography variant="h6" className={classes.grow}>

      </Typography>
      <Button color="inherit" onClick={onLogout}>Ausloggen</Button>
    </Toolbar>
  );
};

NavigationToolbarLoggedIn.propTypes = {
  user: PropTypes.object,
  onLogout: PropTypes.func,
};

export default NavigationToolbarLoggedIn;

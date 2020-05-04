import React from 'react';
import {Link as RouterLink} from 'react-router-dom';

import {Toolbar, IconButton, Icon, Typography, Link} from '@material-ui/core';

import {useStyles} from 'styles';

const NavigationToolbar = () => {
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
        <Link
          component={RouterLink}
          to="/exhibition"
          underline="none"
          className={classes.navLink}
        >
      Ausstellung
        </Link>
      </Typography>
      <Typography variant="button">
        <Link
          component={RouterLink}
          to="/register"
          underline="none"
          className={classes.navLink}
        >
      Registrieren
        </Link>
      </Typography>
      <Typography variant="button">
        <Link
          component={RouterLink}
          to="/login"
          underline="none"
          className={classes.navLink}
        >
      Einloggen
        </Link>
      </Typography>
    </Toolbar>
  );
};

export default NavigationToolbar;

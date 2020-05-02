import React from 'react';
import {Link as RouterLink} from 'react-router-dom';

import {
  AppBar,
  Button,
  Icon,
  IconButton,
  Toolbar,
  Typography,
  Link,
} from '@material-ui/core';

import {useStyles} from 'styles';

/**
 * Navigation element
 * @param  {object} props
 * @return {function} Navigation renderer
 */
function Navigation(props) {
  const classes = useStyles();
  return (
    <AppBar position="static">
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
        <Button color="inherit">Anmelden</Button>
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
      </Toolbar>
    </AppBar>
  );
}

export default Navigation;

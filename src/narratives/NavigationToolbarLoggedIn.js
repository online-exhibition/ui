import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import PropTypes from "prop-types";

import {
  Toolbar,
  IconButton,
  Icon,
  Typography,
  Button,
  Link,
  MenuItem,
  Menu,
} from "@material-ui/core";

import { useStyles } from "styles";

const NavigationToolbarLoggedIn = ({ user, onLogout }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
      <Typography variant="button">
        <Button
          component={RouterLink}
          to="/exhibition"
          underline="none"
          className={classes.navLink}
        >
          Ausstellungen
        </Button>
        <Button
          aria-haspopup="true"
          onClick={handleClick}
          className={classes.navLink}
        >
          Verwalten
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>
            <Link
              component={RouterLink}
              to="/management/exhibition"
              underline="none"
            >
              Ausstellungen
            </Link>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <Link
              component={RouterLink}
              to="/management/images"
              underline="none"
            >
              Bilder
            </Link>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <Link component={RouterLink} to="/upload" underline="none">
              Hochladen
            </Link>
          </MenuItem>
        </Menu>
      </Typography>
      <Typography variant="h6" className={classes.grow}></Typography>
      <Button color="inherit" onClick={onLogout}>
        Ausloggen
      </Button>
    </Toolbar>
  );
};

NavigationToolbarLoggedIn.propTypes = {
  user: PropTypes.object,
  onLogout: PropTypes.func,
};

export default NavigationToolbarLoggedIn;

import React from 'react';
import PropTypes from 'prop-types';
import {Grid, Paper, Typography, Box} from '@material-ui/core';

import {useStyles} from 'styles';

const RegisterSuccess = ({user}) => {
  const classes=useStyles();
  return (
    <Grid container justify="center" spacing={3}>
      <Grid item xs={4}>
        <Paper elevation={3} className={classes.p4}>
          <Grid container justify="center" spacing={2}>
            <Grid item xs={12}>
              <Typography>
                <Box>
                Hallo {user.firstname} {user.name},
                </Box>
                <Box>
                Wir haben eine E-Mail an Ihre E-Mail Adresse
                  {user.email} gesendet. Sie enthält einen Link mit
                Hilfe dessen Sie Ihre Registrierung bestätigen können.
                </Box>
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

RegisterSuccess.propTypes = {
  user: PropTypes.object,
};

export default RegisterSuccess;

import React from 'react';
import PropTypes from 'prop-types';

import {Grid, Paper, Typography} from '@material-ui/core';

import {useStyles} from 'styles';

const LoginSuccess = ({user}) => {
  const classes = useStyles();
  return (
    <Grid container justify="center" spacing={3}>
      <Grid item xs={4}>
        <Paper elevation={3} className={classes.p4}>
          <Grid container justify="center" spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h5" className={classes.mb2}>
                  Hallo {user.firstname} {user.name},
              </Typography>
              <Typography>
                  Willkommen im Foto Labor. Genießen Sie Ihren
                  Aufenthalt und haben Sie viel Spaß.
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

LoginSuccess.propTypes = {
  user: PropTypes.object,
};

export default LoginSuccess;

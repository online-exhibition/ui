import React, {useState, useEffect} from 'react';
import {useLocation, useHistory} from 'react-router-dom';

import {Container, Grid, Paper, CircularProgress} from '@material-ui/core';

import {useStyles} from 'styles';

import {useAjax} from 'components/Ajax';

const Confirm = (props) => {
  const classes=useStyles();
  const location = useLocation();
  const history = useHistory();
  const ajax = useAjax();

  // eslint-disable-next-line no-unused-vars
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(
      (userRequest) => {
        setPending(true);
        const search = new URLSearchParams(location.search);
        ajax
            .get('/api/user/confirm/' + search.get('id'), userRequest)
            .then((data) => {
              setTimeout(() => {
                setPending(false);
                setSuccess(true);
                history.replace('/login');
              }, 1000);
            })
            .catch((err) => {
              setPending(false);
              console.error(err);
            });
      },
      [location, ajax, setPending],
  );

  return (
    <Container maxWidth="lg" className={classes.mt4}>
      <Grid container justify="center" spacing={3}>
        <Grid item xs={4}>
          <Paper elevation={3} className={classes.p4}>
            <Grid container justify="center" spacing={2}>
              {success ? (
                <Grid item xs={12}>
                    Sie sind nun regsitriert und können sich anmelden.
                </Grid>
              ) : (
                  <>
                    <Grid item xs={12}>
                    Ihre Registrierung wird überprüft.
                    </Grid>
                    {pending ? (
                    <Grid item xs={12}>
                      <CircularProgress />
                    </Grid>
                    ) : null}
                  </>
              )}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

Confirm.propTypes = {

};

export default Confirm;

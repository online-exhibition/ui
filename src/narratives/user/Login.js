import React, {useState, useCallback} from 'react';

import {Container} from '@material-ui/core';

import {useStyles} from 'styles';
import {useAjax} from 'components/Ajax';
import {useToatser} from 'components/Toaster';
import {encodeBasic} from 'utils/http';
import LoginForm from './LoginForm';
import LoginSuccess from './LoginSuccess';

const Login = () => {
  const classes = useStyles();
  const ajax = useAjax();
  const {toast} = useToatser();

  const [pending, setPending] = useState(false);
  const {loggedIn, user} = ajax;

  const doSubmit = useCallback(
      (userRequest) => {
        const {username, password} = userRequest;
        setPending(true);
        ajax
            .get('/api/user/login', {
              headers: {
                'Authorization': encodeBasic(username, password),
              },
            })
            .then((data) => {
              setTimeout(() => {
                setPending(false);
                ajax.installAuthorization(
                    encodeBasic(username, password), data);
                toast('Sie sind nun eingeloggt.');
              }, 500);
            })
            .catch((err) => {
              setPending(false);
              console.error(err);
            });
      },
      [ajax, setPending, toast],
  );

  return (
    <Container maxWidth="lg" className={classes.mt4}>
      {loggedIn ? (
        <LoginSuccess user={user} />
      ):(
        <LoginForm busy={pending} onSubmit={doSubmit}/>
      )}
    </Container>
  );
};

export default Login;

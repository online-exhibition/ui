import React, {useState, useCallback} from 'react';

import {Container} from '@material-ui/core';
import {useStyles} from 'styles';
import {useAjax} from 'components/Ajax';
import {encodeBasic} from 'utils/http';
import LoginForm from './LoginForm';
import LoginSuccess from './LoginSuccess';

const Login = () => {
  const classes = useStyles();
  const ajax = useAjax();

  const [isLoggedIn, setIsLoggedIn] = useState(ajax.hasAuthorization());
  const [pending, setPending] = useState(false);
  const [user, setUser] = useState(ajax.getUser());

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
                setUser(data);
                ajax.installAuthorization(
                    encodeBasic(username, password), data);
                setIsLoggedIn(ajax.hasAuthorization());
              }, 3000);
            })
            .catch((err) => {
              setPending(false);
              console.error(err);
            });
      },
      [ajax, setPending, setUser],
  );

  return (
    <Container maxWidth="lg" className={classes.mt4}>
      {isLoggedIn ? (
        <LoginSuccess user={user} />
      ):(
        <LoginForm busy={pending} onSubmit={doSubmit}/>
      )}
    </Container>
  );
};

export default Login;

import React, { useCallback, useState } from "react";

import { Container } from "@material-ui/core";

import { useStyles } from "styles";

import RegisterForm from "./RegisterForm";
import RegisterSuccess from "./RegisterSuccess";

const Register = () => {
  const classes = useStyles();

  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState(false);

  const doSubmit = useCallback(
    (userRequest) => {
      setPending(true);
      // ajax
      //     .post('/api/user', userRequest)
      //     .then((data) => {
      //       setPending(false);
      //       setSuccess(true);
      //       setUser(userRequest);
      //     })
      //     .catch((err) => {
      //       setPending(false);
      //       console.error(err);
      //     });
    },
    [setPending, setSuccess]
  );

  return (
    <Container maxWidth="lg" className={classes.mt4}>
      {success ? (
        <RegisterSuccess user={user} />
      ) : (
        <RegisterForm busy={pending} onSubmit={doSubmit} />
      )}
    </Container>
  );
};

export default Register;

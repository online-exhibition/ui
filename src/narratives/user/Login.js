import React, { useState, useCallback } from "react";

import { Container } from "@material-ui/core";

import { useStyles } from "styles";

import { useToatser } from "components/Toaster";
import { useAuth } from "services/authentication/Authentication";

import LoginForm from "./LoginForm";
import LoginSuccess from "./LoginSuccess";

const Login = () => {
  const classes = useStyles();
  const { toast } = useToatser();
  const { loading, isAuthenticated, login, user } = useAuth();

  const doSubmit = useCallback(
    (userRequest) => {
      const { username, password } = userRequest;
      login(username, password);
    },
    [toast]
  );

  return (
    <Container maxWidth="lg" className={classes.mt4}>
      {isAuthenticated && user ? (
        <LoginSuccess user={user} />
      ) : (
        <LoginForm busy={loading} onSubmit={doSubmit} />
      )}
    </Container>
  );
};

export default Login;

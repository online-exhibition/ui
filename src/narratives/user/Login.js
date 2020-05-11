import React, { useCallback } from "react";

import { Container } from "@material-ui/core";

import { useStyles } from "styles";

import { useAuth } from "services/authentication/Authentication";

import { useStatusMessages } from "components/StatusMessages";

import LoginForm from "./LoginForm";
import LoginSuccess from "./LoginSuccess";

const Login = () => {
  const classes = useStyles();
  const { success, error } = useStatusMessages();
  const { loading, isAuthenticated, login, user } = useAuth();

  const doSubmit = useCallback(
    async (userRequest) => {
      const { username, password } = userRequest;
      try {
        // info("Jetzt wird angemeldet");
        await login(username, password);
        success("Sie wurden erfolgreich angemeldet.");
      } catch (err) {
        error("Sie konnten nicht angemeldet werden.");
      }
    },
    [success, error, login]
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

import React, { useCallback } from "react";

import { Container } from "@material-ui/core";

import { useStyles } from "styles";

import { useAuth } from "services/authentication/Authentication";

import { useStatusMessages } from "components/StatusMessages";

import LoginForm from "./LoginForm";
import LoginSuccess from "./LoginSuccess";
import { useTranslation } from "react-i18next";

const Login = () => {
  const classes = useStyles();
  const { t } = useTranslation("user");
  const { success, error } = useStatusMessages();
  const { loading, isAuthenticated, login, user } = useAuth();

  const doSubmit = useCallback(
    async (userRequest) => {
      const { username, password } = userRequest;
      try {
        await login(username, password);
        success(t("LoginSuccessful"));
      } catch (err) {
        error(t("LoginFailed"));
      }
    },
    [t, success, error, login]
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

import React, { useCallback, useState } from "react";

import { Container } from "@material-ui/core";

import { useStyles } from "styles";

import { useUsers } from "services/user/users";
import RegisterForm from "./RegisterForm";
import RegisterSuccess from "./RegisterSuccess";
import { useToaster } from "components/Toaster";
import { useTranslation } from "react-i18next";

const Register = () => {
  const classes = useStyles();
  const { t } = useTranslation("user");

  const { toast } = useToaster();

  const { create } = useUsers();

  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);

  const doSubmit = useCallback(
    async (userRequest) => {
      setLoading(true);
      try {
        const result = await create(userRequest);
        if (result) {
          setUser(userRequest);
          setSuccess(true);
        }
      } catch (err) {
        console.error(err);
        toast(t("RegistrationFailed"), "error", 10000);
      } finally {
        setLoading(false);
      }
    },
    [t, create, toast, setLoading, setSuccess]
  );

  return (
    <Container maxWidth="lg" className={classes.mt4}>
      {success ? (
        <RegisterSuccess user={user} />
      ) : (
        <RegisterForm busy={loading} onSubmit={doSubmit} />
      )}
    </Container>
  );
};

export default Register;

import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import { Grid, Paper } from "@material-ui/core";

import { useStyles } from "styles";

import Form from "components/forms/Form";
import Input from "components/forms/Input";
import Submit from "components/forms/Submit";

const RegisterForm = ({ busy, onSubmit }) => {
  const classes = useStyles();
  const { t } = useTranslation("user");
  const formValidation = useCallback((data, valid) => {
    return (
      valid &&
      data.password &&
      data.passwordConfirm &&
      data.password === data.passwordConfirm
    );
  }, []);

  return (
    <Form validation={formValidation} onSubmit={onSubmit}>
      <Grid container justify="center" spacing={3}>
        <Grid item xs={4}>
          <Paper elevation={3} className={classes.p4}>
            <Grid container justify="center" spacing={2}>
              <Grid item xs={12}>
                <Input
                  required
                  fullWidth
                  name="username"
                  label={t("Username")}
                />
              </Grid>
              <Grid item xs={12}>
                <Input required fullWidth name="email" label={t("E-Mail")} />
              </Grid>
              <Grid item xs={12}>
                <Input
                  required
                  fullWidth
                  name="firstname"
                  label={t("Firstname")}
                />
              </Grid>
              <Grid item xs={12}>
                <Input required fullWidth name="name" label={t("Givenname")} />
              </Grid>
              <Grid item xs={12}>
                <Input
                  required
                  fullWidth
                  type="password"
                  name="password"
                  label={t("Password")}
                />
              </Grid>
              <Grid item xs={12}>
                <Input
                  required
                  fullWidth
                  type="password"
                  name="passwordConfirm"
                  label={t("PasswordConfirm")}
                />
              </Grid>
              <Grid item xs={12}>
                <Grid justify="flex-end" container>
                  <Grid item xs={5}>
                    <Submit
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      busy={busy}
                    >
                      {t("Register")}
                    </Submit>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Form>
  );
};

RegisterForm.propTypes = {
  busy: PropTypes.bool,
  onSubmit: PropTypes.func,
};

export default RegisterForm;

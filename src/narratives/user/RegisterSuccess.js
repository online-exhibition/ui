import React from "react";
import PropTypes from "prop-types";
import { Grid, Paper, Typography, Box } from "@material-ui/core";

import { useStyles } from "styles";
import { useTranslation } from "react-i18next";

const RegisterSuccess = ({ user }) => {
  const classes = useStyles();
  const { t } = useTranslation("user");
  return (
    <Grid container justify="center" spacing={3}>
      <Grid item xs={4}>
        <Paper elevation={3} className={classes.p4}>
          <Grid container justify="center" spacing={2}>
            <Grid item xs={12}>
              <Typography>
                <Box>{t("Welcome", { ...user })}</Box>
                <Box>{t("RegistrationEmailSent", { ...user })}</Box>
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

RegisterSuccess.propTypes = {
  user: PropTypes.object,
};

export default RegisterSuccess;

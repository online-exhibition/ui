import React from "react";
import PropTypes from "prop-types";
import { Grid, Typography } from "@material-ui/core";

const LabelValue = ({ label, value }) => {
  return (
    <>
      <Grid item xs={4}>
        <Grid container justify="flex-end">
          <Typography variant="caption">{label}</Typography>
        </Grid>
      </Grid>
      <Grid item xs={8}>
        <Typography>{value}</Typography>
      </Grid>
    </>
  );
};

LabelValue.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

export default LabelValue;

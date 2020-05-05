import React from "react";
import PropTypes from "prop-types";

import { Grid } from "@material-ui/core";

const LabelValueList = ({ children, ...props }) => {
  return (
    <Grid {...props} container>
      {children}
    </Grid>
  );
};

LabelValueList.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

export default LabelValueList;

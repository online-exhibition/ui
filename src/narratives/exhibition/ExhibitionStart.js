import React from "react";
import PropTypes from "prop-types";
import { PropTypeExhibition } from "../../prop-types-definitions";
import { Grid, Typography } from "@material-ui/core";
import { useStyles } from "styles";

const ExhibitionStart = ({ exhibition, ...props }) => {
  const classes = useStyles();
  return (
    <Grid container justify="center" alignContent="center" {...props}>
      {exhibition ? (
        <>
          <Grid
            item
            style={{ textAlign: "center" }}
            xs={12}
            className={classes.mb4}
          >
            <Typography variant="h1" style={{ fontFamily: '"Oswald"' }}>
              {exhibition.title}
            </Typography>
            <Typography variant="subtitle1" style={{ fontFamily: '"Oswald"' }}>
              {exhibition.summary}
            </Typography>
          </Grid>
          <Grid item xs={10}>
            <Typography
              ref={(ref) => {
                if (ref) {
                  ref.innerHTML = exhibition.description;
                }
              }}
              variant="body2"
              style={{ fontFamily: '"Oswald"', textAlign: "left" }}
            ></Typography>
          </Grid>
        </>
      ) : (
        <div></div>
      )}
    </Grid>
  );
};

ExhibitionStart.propTypes = {
  exhibition: PropTypeExhibition,
};

export default ExhibitionStart;

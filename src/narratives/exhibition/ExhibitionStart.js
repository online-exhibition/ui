import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { PropTypeExhibition } from "../../prop-types-definitions";
import { Grid, Typography } from "@material-ui/core";
import { useStyles } from "styles";

const ExhibitionStart = ({ exhibition, theme, ...props }) => {
  const classes = useStyles();
  const [fontFamily, setFontFamily] = useState("Roboto");

  useEffect(() => {
    if (theme && Array.isArray(theme.styles)) {
      theme.styles
        .filter((style) => style.name === "font-family")
        .forEach((style) => {
          setFontFamily(style.value);
        });
    }
  }, [theme, setFontFamily]);
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
            <Typography variant="h1" style={{ fontFamily }}>
              {exhibition.title}
            </Typography>
            <Typography variant="subtitle1" style={{ fontFamily }}>
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
              style={{ fontFamily, textAlign: "left" }}
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

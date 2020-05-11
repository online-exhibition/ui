import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import padStart from "lodash/padStart";
import {
  Grid,
  Backdrop,
  CircularProgress,
  makeStyles,
  Typography,
  Icon,
  colors,
  Button,
  Fade,
} from "@material-ui/core";
import { Carousel } from "react-responsive-carousel";

import { useStyles } from "styles";
import { hideAppBar } from "redux/appbar/actions";
import { scaleToScreen } from "utils/dimensions";

import { useExhibition } from "services/management/exhibitions";
import ExhibitionStart from "./ExhibitionStart";

import "./ExhibitionPlayer.css";
import selectors from "redux/selectors";

function wait(timeout) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}

function invertColor(hex, bw) {
  if (hex.indexOf("#") === 0) {
    hex = hex.slice(1);
  }
  // convert 3-digit hex to 6-digits.
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6) {
    throw new Error("Invalid HEX color.");
  }
  let r = parseInt(hex.slice(0, 2), 16);
  let g = parseInt(hex.slice(2, 4), 16);
  let b = parseInt(hex.slice(4, 6), 16);
  if (bw) {
    // http://stackoverflow.com/a/3943023/112731
    return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? "#000000" : "#FFFFFF";
  }
  // invert color components
  r = (255 - r).toString(16);
  g = (255 - g).toString(16);
  b = (255 - b).toString(16);
  // pad each with zeros and return
  return "#" + padStart(r, 1, "0") + padStart(g, 1, "0") + padStart(b, 1, "0");
}

const useLocalStyles = makeStyles((theme) => ({
  main: {
    position: "absolute",
    top: 0,
    height: "100%",
    zIndex: theme.zIndex.drawer - 2,
  },
  start: {
    color: colors.deepOrange[500],
    zIndex: theme.zIndex.drawer - 1,
    textAlign: "right",
    marginRight: 32,
    position: "fixed",
    right: 0,
  },
  carousel: {
    backgroundColor: "white",
  },
  arrowButton: {
    color: colors.deepOrange[500],
  },
}));

const ExhibitionPlayer = () => {
  const body = document.querySelector("body");
  const classes = useStyles();
  const classesLocal = useLocalStyles();

  const { id } = useParams();
  const dispatch = useDispatch();
  const themes = useSelector(selectors.theme.getItems);
  const { loading, exhibition } = useExhibition(id);

  const [carouselWidth, setCarouselWidth] = useState();
  const [imageIndex, setImageIndex] = useState(0);
  const [theme, setTheme] = useState();
  const [arrowStyle, setArrowStyle] = useState();

  const changeTo = useCallback(
    (imageIndex) => {
      setImageIndex(imageIndex);
    },
    [setImageIndex]
  );

  const selectTheme = useCallback(
    (themeName) => {
      const theme = themes.find((entry) => entry.name === themeName);
      if (theme && Array.isArray(theme.styles)) {
        setTheme(theme);
        const slides = document.querySelectorAll("li.slide");
        body.style.transition = "background-color 2s";
        if (slides) {
          slides.forEach((slide) => {
            slide.style.backgroundColor = body.style.backgroundColor;
            slide.style.transition = "background-color 2s";
          });
        }
        theme.styles.forEach((style) => {
          if (style.name === "background-color") {
            const contrastArrowStyle =
              invertColor(style.value, true) === "#000000" ? "white" : "black";
            console.log("Color", style.value, contrastArrowStyle);
            setArrowStyle(contrastArrowStyle);
          }
          body.style[style.name] = style.value;
          if (slides) {
            if (slides) {
              slides.forEach((slide) => {
                slide.style[style.name] = style.value;
              });
            }
          }
        });
      }
    },
    [themes, setArrowStyle]
  );

  useEffect(() => {
    if (exhibition && exhibition.images) {
      const clientRect = document
        .querySelector("#container")
        .getBoundingClientRect();
      let maxWidth = 0;
      exhibition.images.forEach((image) => {
        const { width, height } = scaleToScreen(
          image.width,
          image.height,
          80,
          clientRect.left
        );
        image.scaleWidth = width;
        image.scaleHeight = height;
        maxWidth = Math.max(maxWidth, width);
      });
      setCarouselWidth(maxWidth);
      dispatch(hideAppBar());
    }
    return () => {};
  }, [exhibition, setCarouselWidth, dispatch]);

  useEffect(() => {
    if (exhibition && exhibition.images && exhibition.images[imageIndex]) {
      selectTheme(exhibition.images[imageIndex].name);
    }
  }, [imageIndex, exhibition, selectTheme]);

  useEffect(() => {
    if (exhibition && exhibition.theme) {
      selectTheme(exhibition.theme);
    }
  }, [exhibition, selectTheme]);

  return (
    <Grid
      id="container"
      container
      justify="center"
      style={{ position: "absolute", top: 24 }}
    >
      <Carousel
        showArrows={true}
        showThumbs={false}
        infiniteLoop={true}
        useKeyboardArrows={true}
        width={carouselWidth + "px"}
        showStatus={false}
        onChange={changeTo}
        className={arrowStyle}
      >
        <ExhibitionStart
          exhibition={exhibition}
          theme={theme}
          className={classesLocal.main}
        />
        {exhibition &&
          exhibition.images.map((image, index) => (
            <Grid key={image.id} id={`image_${index}`}>
              <img
                src={`/api/image/${image.id}`}
                style={{ width: image.scaleWidth, height: image.scaleHeight }}
              />
            </Grid>
          ))}
      </Carousel>
    </Grid>
  );
};

export default ExhibitionPlayer;

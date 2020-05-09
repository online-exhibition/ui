import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useExhibition } from "services/management/exhibitions";
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
import { useStyles } from "styles";
import ExhibitionStart from "./ExhibitionStart";
import { Carousel } from "react-responsive-carousel";
import { useDispatch } from "react-redux";
import { scaleToScreen } from "utils/dimensions";
import { hideAppBar } from "redux/appbar/actions";

import "./ExhibitionPlayer.css";

function wait(timeout) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}

const useLocalStyles = makeStyles((theme) => ({
  main: {
    position: "absolute",
    top: 0,
    height: "100%",
    backgroundColor: "white",
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

const themes = [
  {
    name: "white",
    backgroundColor: "white",
    color: "black",
  },
  {
    name: "black",
    backgroundColor: "black",
    color: "white",
  },
  {
    name: "orange",
    backgroundColor: "darkorange",
    color: "white",
  },
];

const ExhibitionPlayer = () => {
  const body = document.querySelector("body");
  const classes = useStyles();
  const classesLocal = useLocalStyles();

  const { id } = useParams();
  const dispatch = useDispatch();
  const { loading, exhibition } = useExhibition(id);

  const [carouselWidth, setCarouselWidth] = useState();
  const [imageIndex, setImageIndex] = useState(0);

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
    if (exhibition) {
      const theme = themes[imageIndex % themes.length];
      const slides = document.querySelectorAll("li.slide");
      body.style.transition = "background-color 2s";
      if (slides) {
        slides.forEach((slide) => {
          slide.style.transition = "background-color 2s";
        });
      }
      Object.keys(theme)
        .filter((key) => key !== "name")
        .forEach((key) => {
          body.style[key] = theme[key];
          if (slides) {
            if (slides) {
              slides.forEach((slide) => {
                slide.style[key] = theme[key];
              });
            }
          }
        });
      console.log(theme);
    }
  }, [imageIndex, exhibition]);

  useEffect(() => {
    const container = document.querySelector("#exhibtionContainer");
    if (container) {
      const clientRect = container.getBoundingClientRect();
    }
  }, [exhibition]);

  const changeTo = useCallback(
    (imageIndex) => {
      setImageIndex(imageIndex);
    },
    [setImageIndex]
  );

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
        className={themes[imageIndex % themes.length].name}
      >
        <ExhibitionStart
          exhibition={exhibition}
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

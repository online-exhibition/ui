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
import { useDispatch, useSelector } from "react-redux";
import { scaleToScreen } from "utils/dimensions";
import { hideAppBar } from "redux/appbar/actions";

import "./ExhibitionPlayer.css";
import selectors from "redux/selectors";

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
    [themes]
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

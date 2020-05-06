import React, { useState, useEffect } from "react";
import { Typography, Grid, makeStyles } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";

import { Carousel } from "react-responsive-carousel";

import { useStyles } from "styles";

import selectors from "redux/selectors";
import { showAppBar, hideAppBar } from "redux/appbar/actions";
import { scaleToScreen } from "utils/dimensions";
import { useExhibition } from "services/management/exhibitions";
import { useParams } from "react-router-dom";

const useLocalStyles = makeStyles((theme) => ({
  carousel: {
    backgroundColor: "#444444",
  },
}));

const Exhibition = () => {
  const classes = useStyles();
  const { id } = useParams();
  const localClasses = useLocalStyles();
  const dispatch = useDispatch();

  const items = useSelector(selectors.exhibition.getItems);
  const { exhibition } = useExhibition(
    id || (items && items.length > 0 && items[0].id)
  );

  const [carouselWidth, setCarouselWidth] = useState();
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    const body = document.querySelector("body");
    const backgroundColor = body.style.backgroundColor;
    return () => {
      body.style.backgroundColor = backgroundColor;
      dispatch(showAppBar());
    };
  }, [dispatch]);

  useEffect(() => {
    const body = document.querySelector("body");
    if (exhibition && exhibition.images) {
      const clientRect = document
        .querySelector("#container")
        .getBoundingClientRect();
      const containerStyle = getComputedStyle(
        document.querySelector("#container")
      );
      console.log("Height", containerStyle.height);
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
      body.style.backgroundColor = "#444444"; // data.backgroundColor;
      dispatch(hideAppBar());
    }
    return () => {};
  }, [exhibition, setCarouselWidth, dispatch]);

  console.log(exhibition, items);

  if (!exhibition) {
    return null;
  }
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        width: "calc(100%)",
        color: exhibition.textColor,
      }}
    >
      <Grid container justify="center">
        <Grid
          id="container"
          item
          xs={12}
          className={classes.ml1 + " " + classes.mr1}
        >
          <Typography variant="h4">{exhibition.title}</Typography>
          <Typography variant="h6">
            {Array.isArray(exhibition.images) &&
              exhibition.images[imageIndex].title}
          </Typography>
        </Grid>
        {exhibition &&
        Array.isArray(exhibition.images) &&
        exhibition.images.length > 0 ? (
          <Carousel
            showArrows={true}
            showThumbs={false}
            infiniteLoop={true}
            useKeyboardArrows={true}
            width={carouselWidth + "px"}
            showStatus={false}
            onChange={setImageIndex}
            className={localClasses.carousel}
          >
            {exhibition.images.map((image) => (
              <Grid key={image.id}>
                <img
                  src={`/api/image/${image.id}`}
                  style={{ width: image.scaleWidth, height: image.scaleHeight }}
                />
              </Grid>
            ))}
          </Carousel>
        ) : (
          <Grid item xs={12}>
            <Typography variant="h4">
              Zur Zeit ist keine Ausstellung aktiv
            </Typography>
            <Typography variant="h6">
              {Array.isArray(exhibition.images) &&
                exhibition.images[0].filename}
            </Typography>
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default Exhibition;

import React, { useState, useEffect } from "react";
import { Typography, Grid, makeStyles } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import selectors from "redux/selectors";
import { useAjax } from "components/Ajax";
import { useStyles } from "styles";
import { showAppBar, hideAppBar } from "redux/appbar/actions";
import { Carousel } from "react-responsive-carousel";
import { scaleToScreen } from "utils/dimensions";

const useLocalStyles = makeStyles((theme) => ({
  carousel: {
    backgroundColor: "#444444",
  },
}));

const Exhibition = () => {
  const classes = useStyles();
  const localClasses = useLocalStyles();
  const ajax = useAjax();
  const dispatch = useDispatch();

  const items = useSelector(selectors.exhibition.getItems);
  const [exhibition, setExhibition] = useState({});
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
    if (items && items.length > 0) {
      ajax.get(`/api/exhibition/${items[0].id}`).then((data) => {
        const clientRect = document
          .querySelector("#container")
          .getBoundingClientRect();
        const containerStyle = getComputedStyle(
          document.querySelector("#container")
        );
        console.log("Height", containerStyle.height);
        let maxWidth = 0;
        data.images.forEach((image) => {
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
        setExhibition(data);
        body.style.backgroundColor = "#444444"; // data.backgroundColor;
        dispatch(hideAppBar());
      });
    }
    return () => {};
  }, [items, setExhibition, setCarouselWidth, dispatch]);

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
              exhibition.images[imageIndex].filename}
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

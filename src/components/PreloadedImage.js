import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { CircularProgress, Grid, makeStyles, colors } from "@material-ui/core";

const useLocalStyles = makeStyles((theme) => ({
  notFound: {
    width: "100%",
    height: "100%",
    verticalAlign: "middle",
    backgroundColor: colors.grey[100],
  },
}));
const PreloadedImage = React.forwardRef(({ src, onLoad, ...props }, ref) => {
  const [loaded, setLoaded] = useState(false);
  const [notFount, setNotFound] = useState(false);

  const classesLocal = useLocalStyles();

  useEffect(() => {
    const img = new Image();
    img.onprogress = (event) => {
      console.log(src, event);
    };
    img.onload = (event) => {
      setLoaded(true);
      onLoad && onLoad();
    };
    img.onerror = (error) => {
      setLoaded(true);
      setNotFound(true);
    };
    img.src = src;
    return () => {
      setLoaded(false);
    };
  }, [src, setLoaded, setNotFound]);

  if (!loaded) {
    return (
      <Grid
        container
        justify="center"
        alignItems="center"
        style={{ height: "100%" }}
      >
        <CircularProgress size={32} />
      </Grid>
    );
  }
  if (notFount) {
    return (
      <Grid
        container
        {...props}
        className={classesLocal.notFound}
        justify="center"
        direction="row"
        alignContent="center"
      >
        Bild nicht vorhanden
      </Grid>
    );
  }
  return <img ref={ref} src={src} {...props} />;
});
PreloadedImage.displayName = "PreloadedImage";

PreloadedImage.propTypes = {
  src: PropTypes.string.isRequired,
  onLoad: PropTypes.func,
};

export default PreloadedImage;

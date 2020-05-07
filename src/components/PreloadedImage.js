import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Grid, makeStyles, colors, LinearProgress } from "@material-ui/core";

const useLocalStyles = makeStyles((theme) => ({
  notFound: {
    width: "100%",
    height: "100%",
    verticalAlign: "middle",
    backgroundColor: colors.grey[100],
  },
  progress: {
    width: "100%",
    marginLeft: "5%",
    marginRight: "5%",
  },
}));

const PreloadedImage = React.forwardRef(({ src, onLoad, ...props }, ref) => {
  const [loaded, setLoaded] = useState(false);
  const [notFount, setNotFound] = useState(false);
  const [progress, setProgress] = useState(0);
  const [imageData, setImageData] = useState();

  const classesLocal = useLocalStyles();

  useEffect(() => {
    (async () => {
      const response = await fetch(src);
      const reader = response.body.getReader();
      const contentLength = +response.headers.get("Content-Length");
      let receivedLength = 0;
      const chunks = [];
      while (receivedLength < contentLength) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        chunks.push(value);
        receivedLength += value.length;
        setProgress((receivedLength / contentLength) * 100);
      }
      setImageData(URL.createObjectURL(new Blob(chunks)));
      setLoaded(true);
    })();
  }, [src, setLoaded, setNotFound, setProgress]);

  if (!loaded) {
    return (
      <Grid
        container
        justify="center"
        alignItems="center"
        style={{ height: "100%" }}
      >
        <LinearProgress
          variant="determinate"
          value={progress}
          className={classesLocal.progress}
        />
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
  return <img ref={ref} src={imageData} {...props} />;
});
PreloadedImage.displayName = "PreloadedImage";

PreloadedImage.propTypes = {
  src: PropTypes.string.isRequired,
  onLoad: PropTypes.func,
};

export default PreloadedImage;

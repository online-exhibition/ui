import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {CircularProgress, Grid} from '@material-ui/core';

const PreloadedImage = ({src, onLoad, ...props}) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onprogress = (event) => {
      console.log(src, event);
    };
    img.onload = (event) => {
      setLoaded(true);
      onLoad && onLoad();
    };
    img.src = src;
    return () => {
      setLoaded(false);
    };
  }, [src, setLoaded]);

  if (!loaded) {
    return <Grid container justify="center" alignItems="center"
      style={{height: '100%'}}>
      <CircularProgress size={32} />
    </Grid>;
  }
  return <img src={src} {...props} />;
};

PreloadedImage.propTypes = {
  src: PropTypes.string.isRequired,
  onLoad: PropTypes.func,
};

export default PreloadedImage;

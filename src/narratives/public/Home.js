import React from 'react';

import {Container, Typography} from '@material-ui/core';
import {useStyles} from 'styles';

const Home = () => {
  const classes = useStyles();
  return (
    <Container maxWidth="lg" className={classes.mt4}>
      <Typography variant="h3">
            FLAB
      </Typography>
    </Container>
  );
};

export default Home;

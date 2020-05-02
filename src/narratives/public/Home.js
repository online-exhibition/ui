import React from 'react';
import PropTypes from 'prop-types';

import {Container, Typography} from '@material-ui/core';

const Home = (props) => {
  return (
    <Container fluid maxWidth="lg">
      <Typography variant="h3">
            FLAB
      </Typography>
    </Container>
  );
};

Home.propTypes = {

};

export default Home;

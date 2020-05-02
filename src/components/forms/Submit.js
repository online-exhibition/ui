import React from 'react';
import PropTypes from 'prop-types';

import {Button, makeStyles, CircularProgress} from '@material-ui/core';

import {FormContext} from './Form';

const useSubmitStyles = makeStyles((theme) => ({
  buttonBusy: {
    color: 'white',
  },
}));

const Submit = ({busy, children, ...props}) => {
  const classes = useSubmitStyles();
  return (
    <FormContext.Consumer>
      {(form) => {
        if (!form) {
          throw new Error('No FormContext available.');
        }
        const {formIsValid, register} = form;
        register({submit: true});
        return (
          <>
            <Button {...props} type="submit" disabled={!formIsValid}>
              {busy ? (
              <CircularProgress size={24} className={classes.buttonBusy} />
            ) : children}
            </Button>
          </>
        );
      }}
    </FormContext.Consumer>
  );
};

Submit.propTypes = {
  busy: PropTypes.bool,
  children: PropTypes.any,
};

export default Submit;

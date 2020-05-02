import React from 'react';
import PropTypes from 'prop-types';

import {Snackbar} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

const Toaster = (props) => {
  const [toast, setToast] = useState({show: false});

  const showToast = useCallback(
      (message, severity = 'info', duration = 3000) => {
        setToast({show: true, message, severity, duration});
      },
      [setToast],
  );

  const closeToast = useCallback(
      (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setToast({show: false});
      },
      [setToast],
  );

  return (
    <Snackbar
      open={toast.show}
      autoHideDuration={toast && toast.duration}
      onClose={closeToast}
    >
      <Alert severity={toast && toast.severity}>
        {toast && toast.message}
      </Alert>
    </Snackbar>
  );
};

Toaster.propTypes = {

};

export default Toaster;

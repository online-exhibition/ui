import React, {useContext, useCallback, useState} from 'react';
import PropTypes from 'prop-types';

import {Snackbar} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

const ToasterContext = React.createContext();
export const useToatser = () => useContext(ToasterContext);

const Toaster = ({children}) => {
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
    <ToasterContext.Provider value={{
      toast: (message, severity, duration) =>
        showToast(message, severity, duration),
    }}>
      {children}
      <Snackbar
        open={toast.show}
        autoHideDuration={toast && toast.duration}
        onClose={closeToast}
      >
        <Alert severity={toast && toast.severity}>
          {toast && toast.message}
        </Alert>
      </Snackbar>
    </ToasterContext.Provider>
  );
};

Toaster.propTypes = {
  children: PropTypes.element,
};

export default Toaster;

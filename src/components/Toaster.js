import React, { useContext, useCallback, useState } from "react";
import PropTypes from "prop-types";

import { Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

const ToasterContext = React.createContext();
export const useToaster = () => useContext(ToasterContext);

const Toaster = ({ children }) => {
  const [toast, setToast] = useState({ show: false });

  const showToast = useCallback(
    (message, severity = "info", duration = 3000) => {
      setToast({ show: true, message, severity, duration });
    },
    [setToast]
  );

  const closeToast = useCallback(
    (event, reason) => {
      if (reason === "clickaway") {
        return;
      }
      setToast({ show: false });
    },
    [setToast]
  );

  return (
    <ToasterContext.Provider
      value={{
        toast: (message, severity, duration) =>
          showToast(message, severity, duration),
        info: (message, duration) => showToast(message, "info", duration),
        success: (message, duration) => showToast(message, "success", duration),
        warning: (message, duration) => showToast(message, "warning", duration),
        error: (message, duration) => showToast(message, "error", duration),
      }}
    >
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
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]),
};

export default Toaster;

import React, { useContext } from "react";
import PropTypes from "prop-types";

import { useSnackbar, SnackbarProvider } from "notistack";

const StatusMessagesContext = React.createContext();
export const useStatusMessages = () => useContext(StatusMessagesContext);

function StatusMessages({ maxMessages = 3, children }) {
  return (
    <SnackbarProvider maxSnack={maxMessages}>
      <StatusMessagesWrapped>{children}</StatusMessagesWrapped>
    </SnackbarProvider>
  );
}

function StatusMessagesWrapped({ maxMessages, children }) {
  const { enqueueSnackbar } = useSnackbar();
  return (
    <StatusMessagesContext.Provider
      value={{
        status: (message) => enqueueSnackbar(message, { variant: "default" }),
        info: (message) => enqueueSnackbar(message, { variant: "info" }),
        warning: (message) => enqueueSnackbar(message, { variant: "warning" }),
        error: (message) => enqueueSnackbar(message, { variant: "error" }),
        success: (message) => enqueueSnackbar(message, { variant: "success" }),
      }}
    >
      {children}
    </StatusMessagesContext.Provider>
  );
}

StatusMessagesWrapped.propTypes = {
  maxMessages: PropTypes.number,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

StatusMessages.propTypes = {
  maxMessages: PropTypes.number,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]),
};

export default StatusMessages;

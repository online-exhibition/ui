import React, { useCallback, useState, useContext } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@material-ui/core";

const ConfirmContext = React.createContext();
export const useConfirm = () => useContext(ConfirmContext);

const ConfirmDialog = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [promise, setPromise] = useState();
  const [title, setTitle] = useState("Kein Titel");
  const [question, setQuestion] = useState("Haben Sie keine Frage?");

  const confirmDialog = useCallback(
    ({ title: newTitle = "", question: newQuestion }) => {
      setTitle(newTitle);
      setQuestion(newQuestion);
      setOpen(true);
      const promise = new Promise((resolve, reject) => {
        setPromise({ resolve, reject });
      });
      return promise;
    },
    [setTitle, setQuestion, setOpen, setPromise]
  );

  const handleYes = useCallback(
    (event) => {
      promise.resolve(true);
      setOpen(false);
    },
    [promise, setOpen]
  );

  const handleNo = useCallback(
    (event) => {
      promise.resolve(false);
      setOpen(false);
    },
    [promise, setOpen]
  );

  return (
    <ConfirmContext.Provider value={{ confirmDialog }}>
      {children}
      <Dialog
        open={open}
        onClose={handleNo}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {title ? (
          <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        ) : null}
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {question}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button name="yes" onClick={handleYes} color="primary">
            Ja
          </Button>
          <Button name="no" onClick={handleNo} color="primary" autoFocus>
            Nein
          </Button>
        </DialogActions>
      </Dialog>
    </ConfirmContext.Provider>
  );
};

ConfirmDialog.propTypes = {};

export default ConfirmDialog;

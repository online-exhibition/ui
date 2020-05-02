import React, { useEffect, useCallback, useState } from 'react';
import PropTypes from 'prop-types';

import get from 'lodash/get';

import {
  makeStyles,
  List,
  ListItem,
  ListItemIcon,
  Checkbox,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Icon,
  TextField,
  Snackbar,
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

import { useStyles } from 'styles';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const EditableList = ({ list, valuePath, onChange }) => {
  const classes = useStyles();

  const [toast, setToast] = useState({ show: false });
  const [canUseClipboard, setCanUseClipboard] = useState(false);
  const [newValue, setNewValue] = useState('');

  const showToast = useCallback(
    (message, severity = 'info', duration = 3000) => {
      setToast({ show: true, message, severity, duration });
    },
    [setToast]
  );

  const closeToast = useCallback(
    (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setToast({ show: false });
    },
    [setToast]
  );

  useEffect(() => {
    navigator.permissions.query({ name: 'clipboard-write' }).then((result) => {
      if (result.state == 'granted' || result.state == 'prompt') {
        setCanUseClipboard(true);
      } else {
        showToast(
          'Das Kopieren in die Zwischenablage kann nicht verwendet werden.',
          'warning'
        );
      }
    });
  }, [setCanUseClipboard]);

  const copyValue = useCallback(
    (value) => () => {
      console.log(canUseClipboard, value);
      if (canUseClipboard) {
        navigator.clipboard
          .writeText(value)
          .then(() => {
            showToast(
              `"${value}" wurde in die Zwischenablage kopiert.`,
              'success'
            );
          })
          .catch((err) => {
            console.error(err);
            showToast(
              `"${value}" konnte nicht in die Zwischenablage kopiert werden.`,
              'error'
            );
          });
      } else {
        showToast(
          `"${value}" kann nicht in die Zwischenablage kopiert werden.`
        );
      }
    },
    [canUseClipboard, showToast]
  );

  const addValue = useCallback(() => {
    if (newValue) {
      onChange &&
        onChange([...list.filter((entry) => entry !== newValue), newValue]);
      setNewValue('');
    }
  }, [list, newValue, setNewValue, onChange]);

  const deleteValue = useCallback(
    (value) => () => {
      if (value) {
        onChange && onChange([...list.filter((entry) => entry !== value)]);
      }
    },
    [list, onChange]
  );

  const changeNewValue = useCallback(
    ({ target }) => {
      setNewValue(target.value);
    },
    [setNewValue]
  );

  return (
    <div className={classes.EditableList}>
      <Snackbar
        open={toast.show}
        autoHideDuration={toast && toast.duration}
        onClose={closeToast}
      >
        <Alert severity={toast && toast.severity}>
          {toast && toast.message}
        </Alert>
      </Snackbar>
      <List>
        {list.map((value) => {
          const labelId = `checkbox-list-label-${value}`;

          return (
            <ListItem
              key={value}
              role={undefined}
              dense
              button
              onClick={copyValue(value)}
            >
              <ListItemText id={labelId} primary={value} />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={deleteValue(value)}
                >
                  <Icon>delete_forever</Icon>
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
        <ListItem>
          <ListItemText>
            <TextField fullWidth value={newValue} onChange={changeNewValue} />
          </ListItemText>
          <ListItemSecondaryAction>
            <IconButton edge="end" aria-label="add" onClick={addValue}>
              <Icon>done</Icon>
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    </div>
  );
};

EditableList.propTypes = {
  list: PropTypes.arrayOf(PropTypes.any).isRequired,
  valuePath: PropTypes.string,
  onChange: PropTypes.func,
};

export default EditableList;

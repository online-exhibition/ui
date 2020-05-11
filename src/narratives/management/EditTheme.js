import React, { useCallback, useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import isEqual from "lodash/isEqual";
import intersection from "lodash/intersection";
import {
  Container,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@material-ui/core";
import ColorPicker from "material-ui-color-picker";

import { useStyles } from "styles";

import { useTheme } from "services/management/themes";
import StyleValuePicker, { StyleProperties } from "components/StyleValuePicker";
import { useSelector } from "react-redux";
import selectors from "redux/selectors";

const EditTheme = () => {
  const classes = useStyles();
  const { id } = useParams();
  const { theme, save } = useTheme(id);
  const themes = useSelector(selectors.theme.getItems);

  const [hasChanges, setHasChanges] = useState(false);
  const [newTheme, setNewTheme] = useState({});
  const [styleAvailable, setStyleAvailable] = useState(true);
  const [currentStyle, setCurrentStyle] = useState();

  useEffect(() => {
    setNewTheme(theme);
  }, [theme, setNewTheme]);

  useEffect(() => {
    if (newTheme && Array.isArray(newTheme.styles)) {
      setStyleAvailable(
        intersection(
          StyleProperties.map((property) => property.name),
          newTheme.styles.map((style) => style.name)
        ).length !== StyleProperties.length
      );
    }
    setHasChanges(!isEqual(theme, newTheme));
  }, [theme, themes, newTheme, setHasChanges, styleAvailable]);

  const onChangeProperty = useCallback(
    ({ target }) => {
      setNewTheme({ ...newTheme, [target.name]: target.value });
    },
    [newTheme, setNewTheme]
  );

  const onStyleChange = useCallback(
    (style) => {
      setCurrentStyle(style);
    },
    [setCurrentStyle]
  );

  const addStyle = useCallback(() => {
    if (currentStyle) {
      const changedTheme = {
        ...newTheme,
        styles: [...newTheme.styles, currentStyle],
      };
      setNewTheme(changedTheme);
      setCurrentStyle();
    }
  }, [currentStyle, newTheme, setNewTheme]);

  const removeStyle = useCallback(
    (index) => {
      return () => {
        const newStyles = [...newTheme.styles];
        newStyles.splice(index, 1);
        const changedTheme = {
          ...newTheme,
          styles: newStyles,
        };
        setNewTheme(changedTheme);
      };
    },
    [newTheme, setNewTheme]
  );

  const updateStyle = useCallback(
    (index) => {
      return (style) => {
        if (!isEqual(newTheme.styles[index], style)) {
          const newStyles = newTheme.styles.map((entry, i) =>
            i === index ? style : entry
          );
          const changedTheme = {
            ...newTheme,
            styles: newStyles,
          };
          setNewTheme(changedTheme);
        }
      };
    },
    [newTheme, setNewTheme]
  );

  const updateTheme = useCallback(async () => {
    await save(newTheme);
  }, [newTheme, save]);
  if (!newTheme) {
    return null;
  }

  return (
    <Container maxWidth="lg" className={classes.mt4}>
      <form>
        <Grid container direction="row" spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              name="name"
              label="Name"
              value={newTheme.name}
              onChange={onChangeProperty}
            />
          </Grid>
          {newTheme && Array.isArray(newTheme.styles)
            ? newTheme.styles.map((style, index) => (
                <React.Fragment key={style.name + "_" + index}>
                  <Grid item xs={1}></Grid>
                  <Grid item xs={9}>
                    <StyleValuePicker
                      style={style}
                      onChange={updateStyle(index)}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={removeStyle(index)}
                    >
                      Entfernen
                    </Button>
                  </Grid>
                </React.Fragment>
              ))
            : null}
          <Grid item xs={1}></Grid>
          <Grid item xs={9}>
            <StyleValuePicker
              disabled={!styleAvailable}
              style={currentStyle}
              onChange={onStyleChange}
            />
          </Grid>
          <Grid item xs={2} style={{ alignSelf: "flex-end" }}>
            <Button
              fullWidth
              variant="contained"
              disabled={currentStyle == null || !styleAvailable}
              onClick={addStyle}
            >
              Hinzufügen
            </Button>
          </Grid>
          <Grid item xs={10}></Grid>
          <Grid item xs={2}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              disabled={!hasChanges}
              onClick={updateTheme}
            >
              Speichern
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default EditTheme;

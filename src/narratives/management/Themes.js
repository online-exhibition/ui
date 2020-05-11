import React, { useCallback, useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import {
  Container,
  List,
  ListItem,
  ListItemIcon,
  Icon,
  ListItemText,
  Divider,
  ListItemAvatar,
  Avatar,
  TextField,
  IconButton,
  ListItemSecondaryAction,
} from "@material-ui/core";

import { useStyles } from "styles";

import { useToatser } from "components/Toaster";

import { useThemes } from "services/management/themes";

const Themes = () => {
  const classes = useStyles;
  const { toast } = useToatser();

  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [themeName, setThemeName] = useState("");

  const { themes, create: createTheme, refresh } = useThemes(page, pageSize);

  const add = useCallback(
    (event) => {
      if (event && event.stopPropagation) {
        event.stopPropagation();
      }
      if (event && event.preventDefault) {
        event.preventDefault();
      }
      if (themeName) {
        (async () => {
          try {
            await createTheme({ name: themeName });
            setThemeName("");
            refresh();
          } catch (err) {
            console.error(err);
            toast("Das neue motiv konnte nicht angelegt werden.", "error");
          }
        })();
      }
    },
    [themeName, setThemeName, toast, refresh]
  );

  return (
    <Container maxWidth="lg" className={classes.mt4}>
      <form onSubmit={add}>
        <List>
          {themes.map((theme) => (
            <ListItem
              component={RouterLink}
              to={`/management/theme/${theme.id}`}
              button
              key={theme.id}
            >
              <ListItemIcon>
                <Icon>art_track</Icon>
              </ListItemIcon>
              <ListItemText primary={theme.name} />
            </ListItem>
          ))}
          <Divider />
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <Icon>fiber_new</Icon>
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <TextField
                  fullWidth
                  value={themeName}
                  onChange={({ target }) => setThemeName(target.value)}
                />
              }
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" type="submit" disabled={!themeName}>
                <Icon>add</Icon>
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </form>
    </Container>
  );
};

export default Themes;

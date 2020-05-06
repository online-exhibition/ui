import React, { useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link as RouterLink } from "react-router-dom";

import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  Icon,
  ListItemText,
  Grid,
  Box,
  TextField,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Typography,
  Switch,
  Container,
} from "@material-ui/core";

import { useStyles } from "styles";

import FormatDateTime from "components/FormatDateTime";
import { useToatser } from "components/Toaster";
import { useExhibitions } from "services/management/exhibitions";

const Exhibitions = () => {
  const classes = useStyles();
  const { toast } = useToatser();
  const {
    exhibitions,
    createNew: createExhibition,
    remove: removeExhibition,
    refresh,
  } = useExhibitions(1);
  console.log("Exhibition", exhibitions);
  const [exhibitionText, setExhibitionText] = useState("");

  const add = useCallback(
    (event) => {
      if (event && event.stopPropagation) {
        event.stopPropagation();
      }
      if (event && event.preventDefault) {
        event.preventDefault();
      }
      if (exhibitionText) {
        (async () => {
          try {
            await createExhibition({ title: exhibitionText });
            setExhibitionText("");
            refresh();
          } catch (err) {
            console.error(err);
            toast(
              "Die neue Ausstellung konnte nicht angelegt werden.",
              "error"
            );
          }
        })();
      }
    },
    [exhibitionText, setExhibitionText, toast, refresh]
  );

  const remove = (exhibition) => {
    return async () => {
      await removeExhibition(exhibition.id);
      refresh();
    };
  };

  return (
    <Container maxWidth="lg" className={classes.mt4}>
      <form onSubmit={add}>
        <List>
          {exhibitions &&
            exhibitions.map((exhibition) => (
              <ListItem
                component={RouterLink}
                to={`/management/exhibition/${exhibition.id}`}
                key={exhibition.id}
                button
              >
                <ListItemAvatar>
                  <Avatar>
                    <Icon>image</Icon>
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={exhibition.title}
                  secondary={
                    <>
                      {exhibition.expire ? (
                        <>
                          <Typography
                            component="span"
                            variant="body2"
                            className={classes.mr1}
                          >
                            Gültig bis:
                          </Typography>
                          <Typography component="span" className={classes.mr1}>
                            <FormatDateTime
                              value={exhibition.expire}
                              date
                              time={false}
                            />
                          </Typography>
                        </>
                      ) : null}
                      <Typography
                        component="span"
                        variant="body2"
                        className={classes.mr1}
                      >
                        Erstellt am:
                      </Typography>
                      <Typography component="span">
                        <FormatDateTime value={exhibition.created} />
                      </Typography>
                    </>
                  }
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    onChange={() => {
                      exhibition.active = !exhibition.active;
                    }}
                    checked={exhibition.active}
                  />
                  <IconButton
                    edge="end"
                    component={RouterLink}
                    to={`/exhibition/${exhibition.id}`}
                    target="_blank"
                  >
                    <Icon>play_circle_outline</Icon>
                  </IconButton>
                  <IconButton edge="end" onClick={remove(exhibition)}>
                    <Icon>delete</Icon>
                  </IconButton>
                </ListItemSecondaryAction>
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
                  value={exhibitionText}
                  onChange={({ target }) => setExhibitionText(target.value)}
                />
              }
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" type="submit" disabled={!exhibitionText}>
                <Icon>add</Icon>
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </form>
    </Container>
  );
};

export default Exhibitions;

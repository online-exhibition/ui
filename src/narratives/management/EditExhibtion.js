import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import isEqual from "lodash/isEqual";
import omit from "lodash/omit";
import { useHistory, useParams } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";

import { Grid, TextField, Button, IconButton, Icon } from "@material-ui/core";
import { KeyboardDatePicker } from "@material-ui/pickers";

import { useStyles } from "styles";

import { useToatser } from "components/Toaster";
import { useConfirm } from "components/ConfirmDialog";
import ImageList from "components/ImageList";

import { useExhibition } from "services/management/exhibitions";
import { useImages } from "services/management/images";
import DropzoneExhibition from "./DropzoneExhibition";

const EditExhibtion = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();
  const { toast } = useToatser();
  const { confirmDialog } = useConfirm();

  const [page, setPage] = useState(1);

  const { exhibition, save } = useExhibition(id);
  const { images, pageCount } = useImages(page, 10);

  const [newExhibition, setNewExhibition] = useState(exhibition);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setNewExhibition(exhibition);
  }, [exhibition, setNewExhibition]);

  useEffect(() => {
    setHasChanges(
      !isEqual(omit(exhibition, "images"), omit(newExhibition, "images"))
    );
  }, [exhibition, newExhibition, setHasChanges]);

  const onChange = useCallback(
    (data) => {
      setNewExhibition(data);
    },
    [setNewExhibition]
  );

  const onChangeDate = useCallback(
    (date) => {
      setNewExhibition({ ...newExhibition, expire: date.toISOString() });
    },
    [newExhibition, setNewExhibition]
  );
  const onChangeProperty = useCallback(({ target }) => {
    setNewExhibition({ ...newExhibition, [target.name]: target.value });
  });

  const onSubmit = useCallback(
    async (event) => {
      if (event.stopPropagation) {
        event.stopPropagation();
      }
      if (event.preventDefault) {
        event.preventDefault();
      }
      await save(newExhibition);
    },
    [newExhibition, save]
  );
  if (!newExhibition) {
    return null;
  }
  return (
    <Grid container direction="row" className={classes.mt4}>
      <Grid item xs={3} className={[classes.pl3, classes.pr3].join(" ")}>
        <form onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="title"
                label="Titel"
                value={newExhibition.title}
                onChange={onChangeProperty}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="description"
                label="Beschreibung"
                value={newExhibition.description}
                multiline
                rows={4}
                onChange={onChangeProperty}
              />
            </Grid>
            <Grid item xs={6}>
              <KeyboardDatePicker
                label="Ablaufdatum"
                disableToolbar
                disablePast
                value={newExhibition.expire}
                onChange={onChangeDate}
              />
            </Grid>
            <Grid item xs={12}>
              <Grid container justify="flex-end" alignItems="center">
                <Grid item xs={8}>
                  <IconButton
                    edge="end"
                    component={RouterLink}
                    to={`/exhibition/${exhibition.id}`}
                    target="_blank"
                    className={classes.mr3}
                  >
                    <Icon fontSize="large">play_circle_outline</Icon>
                  </IconButton>
                </Grid>
                <Grid item xs={4}>
                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={!hasChanges}
                  >
                    Speichern
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Grid>
      <Grid item xs={6} className={[classes.pr3].join(" ")}>
        <DropzoneExhibition exhibition={newExhibition} onChange={onChange} />
      </Grid>
      <Grid item xs={3} className={[classes.pr3].join(" ")}>
        <ImageList
          title="Ihre Bilder"
          cols={2}
          images={images}
          draggable
          dropTarget={newExhibition}
          page={page}
          pageCount={pageCount}
          onNewPage={(pageIndex) => setPage(pageIndex)}
        />
      </Grid>
    </Grid>
  );
};

EditExhibtion.propTypes = {};

export default EditExhibtion;

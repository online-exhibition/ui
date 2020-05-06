import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useParams, useHistory } from "react-router-dom";

import {
  Backdrop,
  CircularProgress,
  Grid,
  TextField,
  Button,
  Typography,
} from "@material-ui/core";
import isEqual from "lodash/isEqual";

import { useImage } from "services/management/images";

import { useStyles } from "styles";

import PreloadedImage from "components/PreloadedImage";
import FormatBytes from "components/FormatBytes";
import FormatExposure from "components/FormatExposure";
import LabelValueList from "components/LabelValueList";
import LabelValue from "components/LabelValue";
import FormatAperture from "components/FormatAperture";
import { useConfirm } from "components/ConfirmDialog";
import { useToatser } from "components/Toaster";
import FormatDateTime from "components/FormatDateTime";

const EditImage = ({}) => {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();
  const { toast } = useToatser();
  const { confirmDialog } = useConfirm();

  const { loading, image, save, remove } = useImage(id);

  const [newImage, setNewImage] = useState({
    author: "",
    title: "",
    description: "",
    category: "",
  });
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (image) {
      setNewImage(image);
    }
  }, [image]);

  useEffect(() => {
    setHasChanges(!isEqual(image, newImage));
  }, [image, newImage, setHasChanges]);

  const valueChange = useCallback(
    ({ target }) => {
      setNewImage({ ...newImage, [target.name]: target.value });
    },
    [newImage, setNewImage]
  );

  const saveNewImage = useCallback(
    (e) => {
      if (e && e.preventDefault) {
        e.preventDefault();
      }
      if (e && e.stopPropagation) {
        e.stopPropagation();
      }
      save(newImage);
    },
    [newImage, save]
  );

  const deleteImage = useCallback(() => {
    (async () => {
      const canDelete = await confirmDialog({
        title: "Bild löschen?",
        question: "Möchten Sie das Bild wirklich löschen?",
      });
      if (canDelete) {
        const deleted = await remove();
        if (deleted) {
          history.goBack();
        } else {
          toast("Das Bild konnte nicht gelöscht werden.", "error", 5000);
        }
      }
    })();
  }, [confirmDialog]);

  return (
    <>
      {image ? (
        <Grid container direction="row" className={classes.mt4}>
          <Grid item xs={6} className={[classes.pl3, classes.pr3].join(" ")}>
            <PreloadedImage
              src={`/api/image/${id}`}
              style={{ width: "100%" }}
            />
          </Grid>
          <Grid item xs={6} className={[classes.pr3].join(" ")}>
            <form onSubmit={saveNewImage}>
              <Grid container direction="row">
                <Grid item xs={8} className={classes.pr3}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        name="filename"
                        value={image.filename}
                        label={"Dateiname"}
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        name="author"
                        value={newImage.author || ""}
                        label={"Autor"}
                        onChange={valueChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        name="title"
                        value={newImage.title || ""}
                        label={"Titel"}
                        onChange={valueChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        name="description"
                        value={newImage.description || ""}
                        label={"Beschreibung"}
                        onChange={valueChange}
                        multiline
                        rows={4}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        name="category"
                        value={newImage.category || ""}
                        label={"Kategorie"}
                        onChange={valueChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Grid container direction="row" justify="space-between">
                        <Grid item xs={3}>
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
                        <Grid item xs={3}>
                          <Button
                            fullWidth
                            variant="contained"
                            color="secondary"
                            onClick={deleteImage}
                          >
                            Bild löschen
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={4}>
                  <LabelValueList spacing={1}>
                    <LabelValue
                      label="Erstellt am:"
                      value={<FormatDateTime value={image.originalCreated} />}
                    />
                    <LabelValue
                      label="Abmessung:"
                      value={`${image.width}x${image.height}`}
                    />
                    <LabelValue
                      label="Größe:"
                      value={
                        <>
                          <FormatBytes iec={false} value={image.size} /> (
                          <FormatBytes iec value={image.size} />)
                        </>
                      }
                    />
                    {image.exif ? (
                      <>
                        <LabelValue
                          label="Kamera:"
                          value={`${image.exif.Make} ${image.exif.Model}`}
                        />
                        <LabelValue
                          label="Objektiv:"
                          value={`${image.exif.LensMake} ${image.exif.LensModel}`}
                        />
                        <LabelValue label="ISO:" value={`${image.exif.ISO}`} />
                        <LabelValue
                          label="Blende:"
                          value={<FormatAperture value={image.exif.FNumber} />}
                        />
                        <LabelValue
                          label="Brennweite:"
                          value={`${image.exif.FocalLength}mm (${image.exif.FocalLengthIn35mmFormat}mm)`}
                        />
                        <LabelValue
                          label="Verschlusszeit"
                          value={
                            <FormatExposure value={image.exif.ExposureTime} />
                          }
                        />
                      </>
                    ) : null}
                  </LabelValueList>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
      ) : null}

      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

EditImage.propTypes = {};

export default EditImage;

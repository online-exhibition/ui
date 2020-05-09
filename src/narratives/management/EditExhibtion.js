import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import isEqual from "lodash/isEqual";
import omit from "lodash/omit";
import { useHistory, useParams } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";

import {
  Grid,
  TextField,
  Button,
  IconButton,
  Icon,
  Select,
  MenuItem,
  AppBar,
  Tabs,
  Tab,
  Paper,
  Container,
  makeStyles,
  InputLabel,
  FormControl,
} from "@material-ui/core";
import { KeyboardDatePicker } from "@material-ui/pickers";

import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import CKEditor from "@ckeditor/ckeditor5-react";

import { useStyles } from "styles";

import { useToatser } from "components/Toaster";
import { useConfirm } from "components/ConfirmDialog";
import ImageList from "components/ImageList";

import { useExhibition } from "services/management/exhibitions";
import { useImages } from "services/management/images";

import DropzoneExhibition from "./DropzoneExhibition";

import "./EditExhibition.css";

// eslint-disable-next-line react/prop-types
function TabPanel({ children, value, index, ...props }) {
  const classes = useStyles();
  return (
    <div hidden={value !== index} className={classes.mt4}>
      {children}
    </div>
  );
}

const EditExhibtion = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();
  const { toast } = useToatser();
  const { confirmDialog } = useConfirm();

  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState(0);

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

  const onChangeStartDate = useCallback(
    (date) => {
      setNewExhibition({ ...newExhibition, start: date.toISOString() });
    },
    [newExhibition, setNewExhibition]
  );

  const onChangeExpireDate = useCallback(
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
    <>
      {" "}
      <AppBar position="static">
        <Tabs value={activeTab} onChange={(_, value) => setActiveTab(value)}>
          <Tab label="Metadaten" />
          <Tab label="Bilder Auswahl" />
        </Tabs>
      </AppBar>
      <Container>
        <TabPanel value={activeTab} index={0}>
          <Grid container direction="row">
            <Grid item xs={12} className={[classes.pl3, classes.pr3].join(" ")}>
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
                      name="summary"
                      label="Kurzbeschreibung"
                      value={newExhibition.summary}
                      multiline
                      rows={4}
                      onChange={onChangeProperty}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <KeyboardDatePicker
                      label="Startdatum"
                      disableToolbar
                      value={newExhibition.start}
                      onChange={onChangeStartDate}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <KeyboardDatePicker
                      label="Ablaufdatum"
                      disableToolbar
                      disablePast
                      value={newExhibition.expire}
                      onChange={onChangeExpireDate}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel id="theme-select-label">Motiv</InputLabel>
                      <Select labelId="theme-select-label" value="white">
                        <MenuItem value="white">Weiß</MenuItem>
                        <MenuItem value="black">Schwarz</MenuItem>
                        <MenuItem value="orange">Orange</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container justify="flex-end" alignItems="center">
                      <Grid item xs={8}>
                        <IconButton
                          edge="end"
                          component={RouterLink}
                          to={`/exhibition/${exhibition.id}`}
                          target={exhibition.id}
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
                  <Grid item xs={12}>
                    <CKEditor
                      editor={ClassicEditor}
                      data={exhibition.description}
                      config={{
                        toolbar: {
                          items: [
                            "heading",
                            "|",
                            "bold",
                            "italic",
                            "link",
                            "|",
                            "bulletedList",
                            "numberedList",
                            "quotes",
                            "|",
                            "insertTable",
                            "mediaEmbed",
                            "|",
                            "undo",
                            "redo",
                          ],
                        },
                      }}
                      onInit={(editor) => {
                        console.log("Editor is ready to use!", editor);
                      }}
                      onChange={(event, editor) => {
                        const value = editor.getData();
                        onChangeProperty({
                          target: { name: "description", value },
                        });
                      }}
                      onBlur={(event, editor) => {
                        console.log("Blur.", editor);
                      }}
                      onFocus={(event, editor) => {
                        console.log("Focus.", editor);
                      }}
                    />
                  </Grid>
                </Grid>
              </form>
            </Grid>
          </Grid>
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          <Grid container direction="row">
            <Grid item xs={9} className={[classes.pr3].join(" ")}>
              <DropzoneExhibition
                exhibition={newExhibition}
                onChange={onChange}
              />
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
        </TabPanel>
      </Container>
    </>
  );
};

EditExhibtion.propTypes = {};

export default EditExhibtion;

import React, { useCallback, useState, useEffect } from "react";
import {
  Container,
  Grid,
  LinearProgress,
  List,
  ListItem,
  Avatar,
  Icon,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  IconButton,
  Button,
} from "@material-ui/core";
import * as uuid from "uuid";

import { useStyles } from "styles";
import { useToatser } from "components/Toaster";
import { useUpload } from "services/management/upload";
import { useAuth } from "services/authentication/Authentication";
import { toIECBytes } from "components/FormatBytes";

const Upload = () => {
  const classes = useStyles();
  const { toast } = useToatser();
  const { getTokenSilently } = useAuth();

  const [formRef] = useState(React.createRef());
  const [chooserId] = useState(uuid.v4());
  const [imageId, setImageId] = useState();
  const [uploading, setUploading] = useState(false);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [file, setFile] = useState();
  const [selectedFiles, setSelectedFiles] = useState([]);

  const { progress, upload } = useUpload();

  const startUpload = () => {
    const formData = new FormData(formRef.current);
    const files = formData.getAll("images");
    let uploadIndex = 0;
    setUploadedCount(0);
    const doUpload = () => {
      (async () => {
        setFile(files[uploadIndex]);
        setUploading(true);
        upload("/api/upload", { name: "image", file: files[uploadIndex] }).then(
          (data) => {
            setUploadedCount(uploadIndex + 1);
            uploadIndex++;
            if (uploadIndex < files.length) {
              doUpload();
            } else {
              setUploading(false);
            }
          }
        );
      })();
    };
    doUpload();
  };

  useEffect(() => {
    if (uploading) {
      const newFiles = [...selectedFiles];
      const changedFile = newFiles.find(
        (entry) => file && entry && entry.name === file.name
      );
      if (changedFile) {
        changedFile.progress = progress;
        setSelectedFiles(newFiles);
      }
    }
  }, [uploading, progress, file, selectedFiles, setSelectedFiles]);

  const filesChosen = useCallback((event) => {
    const formData = new FormData(formRef.current);
    const files = formData.getAll("images");
    setSelectedFiles(
      files.map((file) => ({
        name: file.name,
        size: file.size,
        lastModified: file.lastModified,
        progress: 0,
        file,
      }))
    );
  }, []);

  return (
    <Container maxWidth="lg" className={classes.mt4}>
      <form
        ref={formRef}
        action="/api/upload"
        method="post"
        encType="multipart/form-data"
      >
        <input
          id={chooserId}
          type="file"
          name="images"
          multiple
          accept=".png,.jpeg,.jpg"
          onChange={filesChosen}
          style={{
            width: "0.1px",
            height: "0.1px",
            opacity: "0",
            overflow: "hidden",
            position: "absolute",
            zIndex: -1,
          }}
        />
        <Button
          component="label"
          variant="contained"
          color="default"
          htmlFor={chooserId}
          className={classes.mr4}
        >
          Dateien auswählen
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={startUpload}
          disabled={selectedFiles.length === 0}
        >
          Hochladen
        </Button>
      </form>
      <Grid container>
        <Grid item xs={12}>
          <List>
            {selectedFiles.map((file) => (
              <ListItem key={file.name}>
                <ListItemAvatar>
                  <Avatar>
                    <Icon>image</Icon>
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <LinearProgress
                      variant="determinate"
                      value={file.progress}
                    />
                  }
                  secondary={`${file.name} - Größe: ${toIECBytes(file.size)}`}
                />
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
      {imageId ? (
        <Grid>
          <img src={`/api/image/${imageId}`} />
        </Grid>
      ) : null}
    </Container>
  );
};

export default Upload;

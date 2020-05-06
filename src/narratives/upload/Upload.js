import React, { useCallback, useState } from "react";
import { Container, Grid } from "@material-ui/core";

import { useStyles } from "styles";
import { useToatser } from "components/Toaster";
import { createUpload } from "services/management/upload";
import { useAuth } from "services/authentication/Authentication";

const Upload = () => {
  const classes = useStyles();
  const { toast } = useToatser();
  const { getTokenSilently } = useAuth();

  const [formRef] = useState(React.createRef());
  const [imageId, setImageId] = useState();
  const [uploadedCount, setUploadedCount] = useState(0);

  const upload = () => {
    const formData = new FormData(formRef.current);
    const files = formData.getAll("images");
    let uploadIndex = 0;
    setUploadedCount(0);
    const doUpload = () => {
      (async () => {
        console.log(uploadIndex, files.length);
        const upload = createUpload({
          Authorization: await getTokenSilently(),
        });
        upload("/api/upload", { name: "image", file: files[uploadIndex] }).then(
          (data) => {
            setUploadedCount(uploadIndex + 1);
            uploadIndex++;
            if (uploadIndex < files.length) {
              doUpload();
            }
          }
        );
      })();
    };
    doUpload();
  };

  const filesChosen = useCallback((event) => {}, []);
  return (
    <Container maxWidth="lg" className={classes.mt4}>
      {uploadedCount} Datein wurden hochgeladen.
      <form
        ref={formRef}
        action="/api/upload"
        method="post"
        encType="multipart/form-data"
      >
        <input
          type="file"
          name="images"
          multiple
          accept=".png,.jpeg,.jpg"
          onChange={filesChosen}
        />

        <button type="button" onClick={upload}>
          Hochladen
        </button>
      </form>
      {imageId ? (
        <Grid>
          <img src={`/api/image/${imageId}`} />
        </Grid>
      ) : null}
    </Container>
  );
};

export default Upload;

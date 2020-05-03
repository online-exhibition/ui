import React, {useCallback, useState} from 'react';
import {Container, Grid} from '@material-ui/core';

import {useStyles} from 'styles';
import {useToatser} from 'components/Toaster';
import {useAjax} from 'components/Ajax';

const Upload = () => {
  const classes = useStyles();
  const ajax = useAjax();
  const {toast} = useToatser();
  const [formRef] = useState(React.createRef());

  const [imageId, setImageId] = useState();

  const upload = () => {
    const formData = new FormData(formRef.current);
    const files = formData.getAll('images');
    let uploadIndex = 0;
    const doUpload = () => {
      console.log(uploadIndex, files.length);
      ajax.upload('/api/upload',
          {name: 'image', file: files[uploadIndex]})
          .then((data) => {
            uploadIndex++;
            if (uploadIndex < files.length) {
              doUpload();
            }
          });
    };
    doUpload();
  };


  const filesChosen = useCallback((event) => {
  }, []);
  return (
    <Container maxWidth="lg" className={classes.mt4}>
      <form ref={formRef} action="/api/upload" method="post" encType="multipart/form-data">
        <input type="file" name="images" multiple accept=".png,.jpeg,.jpg" onChange={filesChosen} />

        <button type="button" onClick={upload}>Hochladen</button>
      </form>
      {imageId ? <Grid>
        <img src={`/api/image/${imageId}`} />
      </Grid> : null}
    </Container>
  );
};

export default Upload;

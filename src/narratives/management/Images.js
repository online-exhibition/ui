import React, {useState, useEffect, useCallback} from 'react';

import {
  GridList,
  GridListTile,
  ListSubheader,
  GridListTileBar,
  IconButton,
  Icon,
  Container,
  Popover,
  Typography}
  from '@material-ui/core';

import InfiniteScroll from 'react-infinite-scroll-component';

import {useStyles} from 'styles';
import {useAjax} from 'components/Ajax';
import {useToatser} from 'components/Toaster';
import FormatBytes from 'components/FormatBytes';
import PreloadedImage from 'components/PreloadedImage';

const Images = () => {
  const classes = useStyles();
  const ajax = useAjax();
  const {toast} = useToatser();
  const [images, setImages] = useState([]);
  const [skip, setSkip] = useState(0);
  const [maxLength, setMaxLength] = useState(20);
  const [pop, setPop] = useState(false);
  const [anchor, setAnchor] = useState();

  const fetchData = useCallback(() => {
    ajax.get(`/api/management/image?skip=${skip}`, {returnResponse: true})
        .then(async (response) => {
          const data = await response.json();
          console.log(data);
          setMaxLength(parseInt(response.headers['X-Count'], 10));
          setImages([...images, ...data]);
          setSkip(skip + 10);
        })
        .catch((err) => {
          console.error(err);
          toast('Die Liste der Bilder konnte nicht geladen werden.',
              'error', 5000);
        });
  }, [images, setImages, skip, setSkip, setMaxLength]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Container maxWidth="lg" className={classes.mt4}>
      <InfiniteScroll
        dataLength={images.length}
        next={fetchData}
        hasMore={true}
      >
        <GridList cellHeight={180} cols={3}>
          <GridListTile key="Subheader" cols={3} style={{height: 'auto'}}>
            <ListSubheader component="div">December</ListSubheader>
          </GridListTile>
          {images.map((tile) => (
            <GridListTile key={tile.id}>
              <PreloadedImage src={tile.$href} alt={tile.filename}
                className={'MuiGridListTile-imgFullWidth'} />
              <GridListTileBar
                title={tile.filename}
                subtitle={<>
                  {tile.category &&
                    <span className={classes.mr1}>Kategorie:{' '}
                      {tile.category}</span>}
                  <span className={classes.mr1}>Größe:{' '}
                    <FormatBytes value={tile.size} /></span>
                  {tile.author &&
                    <span className={classes.mr1}>Author:{' '}
                      {tile.author}</span>}
                </>}
                actionIcon={
                  <>
                    <IconButton aria-label={`info about ${tile.filename}`}
                      className={classes.silentIcon} onClick={ (event) => {
                        setAnchor(event.currentTarget);
                        setPop(true);
                      }}>
                      <Icon>info</Icon>
                    </IconButton>
                  </>
                }
              />
            </GridListTile>
          ))}
        </GridList>
      </InfiniteScroll>
      <Popover open={pop} anchorEl={anchor} onClick={() => setPop(false)}>
        <Typography variant="h6" className={classes.m2}>The content of the Popover.</Typography>
      </Popover>
    </Container>
  );
};

export default Images;

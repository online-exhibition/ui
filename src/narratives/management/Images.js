import React, { useState, useEffect, useCallback } from "react";
import { Link as RouterLink, useLocation, useHistory } from "react-router-dom";

import {
  GridList,
  GridListTile,
  ListSubheader,
  GridListTileBar,
  IconButton,
  Icon,
  Container,
  Popover,
  Typography,
  Grid,
} from "@material-ui/core";
import { Pagination } from "@material-ui/lab";

import { useStyles } from "styles";

import { useToatser } from "components/Toaster";
import FormatBytes from "components/FormatBytes";
import PreloadedImage from "components/PreloadedImage";

import { useImages } from "services/management/images";

const Images = () => {
  const classes = useStyles();
  const { toast } = useToatser();
  const history = useHistory();
  const location = useLocation();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const { images, count, pageCount } = useImages(page, pageSize);

  const [pop, setPop] = useState(false);
  const [anchor, setAnchor] = useState();

  useEffect(() => {
    const search = new URLSearchParams(location.search);
    setPage(parseInt(search.get("page") || 1, 10));
  }, [location, setPage]);

  return (
    <Container maxWidth="lg" className={classes.mt4}>
      <GridList cellHeight={180} cols={3}>
        <GridListTile key="Subheader" cols={3} style={{ height: "auto" }}>
          <ListSubheader component="div">Anzahl Bilder: {count}</ListSubheader>
        </GridListTile>
        {images.map((tile) => (
          <GridListTile key={tile.id}>
            <PreloadedImage
              src={tile.$href}
              alt={tile.filename}
              className={"MuiGridListTile-imgFullWidth"}
            />
            <GridListTileBar
              title={tile.filename}
              subtitle={
                <>
                  {tile.category && (
                    <span className={classes.mr1}>
                      Kategorie: {tile.category}
                    </span>
                  )}
                  <span className={classes.mr1}>
                    Größe: <FormatBytes value={tile.size} />
                  </span>
                  {tile.author && (
                    <span className={classes.mr1}>Author: {tile.author}</span>
                  )}
                </>
              }
              actionIcon={
                <>
                  <IconButton
                    component={RouterLink}
                    to={`/images/${tile.id}`}
                    aria-label={`info about ${tile.filename}`}
                    className={classes.silentIcon}
                    onClick={(event) => {}}
                  >
                    <Icon>edit</Icon>
                  </IconButton>
                </>
              }
            />
          </GridListTile>
        ))}
        <GridListTile cols={3} className={classes.mt3}>
          <Grid container justify="center">
            <Pagination
              page={page}
              count={pageCount}
              variant="outlined"
              color="primary"
              onChange={(event, pageIndex) =>
                history.push(
                  location.pathname +
                    "?" +
                    new URLSearchParams({ page: pageIndex })
                )
              }
            />
          </Grid>
        </GridListTile>
      </GridList>
      <Popover open={pop} anchorEl={anchor} onClick={() => setPop(false)}>
        <Typography variant="h6" className={classes.m2}>
          The content of the Popover.
        </Typography>
      </Popover>
    </Container>
  );
};

export default Images;

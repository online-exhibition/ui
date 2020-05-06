import React from "react";

import PropTypes from "prop-types";
import { PropTypeImage } from "prop-types-definitions";

import {
  GridList,
  GridListTile,
  ListSubheader,
  GridListTileBar,
  IconButton,
  Icon,
} from "@material-ui/core";
import { useStyles } from "styles";
import FormatBytes from "./FormatBytes";
import FormatDateTime from "./FormatDateTime";
import PreloadedImage from "./PreloadedImage";
import DraggableImage from "./DraggableImage";
import { Pagination } from "@material-ui/lab";

const ImageList = React.forwardRef(
  (
    { title, cols = 2, images, page, pageCount, onNewPage, draggable = false },
    ref
  ) => {
    const classes = useStyles();

    return (
      <GridList ref={ref}>
        {title ? (
          <GridListTile key="Subheader" cols={cols} style={{ height: "auto" }}>
            <ListSubheader component="div">{title}</ListSubheader>
          </GridListTile>
        ) : null}
        {onNewPage ? (
          <GridListTile
            cols={cols}
            style={{ height: "auto" }}
            className={classes.mb2}
          >
            <Pagination
              page={page}
              count={pageCount}
              variant="outlined"
              color="primary"
              onChange={(event, pageIndex) => onNewPage(pageIndex)}
            />
          </GridListTile>
        ) : null}
        {Array.isArray(images) && images.length > 0
          ? images.map((image) => (
              <GridListTile key={image.id} style={{ height: 120 }}>
                {draggable ? (
                  <DraggableImage
                    src={`/api/image/${image.id}`}
                    alt={image.title}
                    className={"MuiGridListTile-imgFullWidth"}
                    dragSource={image}
                  />
                ) : (
                  <PreloadedImage
                    src={`/api/image/${image.id}`}
                    alt={image.title}
                    className={"MuiGridListTile-imgFullWidth"}
                  />
                )}
                <GridListTileBar
                  title={image.title}
                  subtitle={
                    <>
                      {image.originalCreated && (
                        <span className={classes.mr1}>
                          Erstellt am:{" "}
                          <FormatDateTime value={image.originalCreated} />
                        </span>
                      )}
                      {image.size && (
                        <span className={classes.mr1}>
                          Größe: <FormatBytes value={image.size} />
                        </span>
                      )}
                      {image.author && (
                        <span className={classes.mr1}>
                          Author: {image.author}
                        </span>
                      )}
                    </>
                  }
                  actionIcon={
                    <IconButton
                      aria-label={`${image.title}`}
                      style={{ color: "silver" }}
                    >
                      <Icon>info</Icon>
                    </IconButton>
                  }
                />
              </GridListTile>
            ))
          : null}
      </GridList>
    );
  }
);
ImageList.displayName = "ImageList";

ImageList.propTypes = {
  title: PropTypes.string,
  cols: PropTypes.number,
  images: PropTypes.arrayOf(PropTypeImage),
  draggable: PropTypes.bool,
};

export default ImageList;

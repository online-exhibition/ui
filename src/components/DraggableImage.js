import React from "react";
import PropTypes from "prop-types";

import { useDrag } from "react-dnd";

import PreloadedImage from "./PreloadedImage";

const DraggableImage = ({ dragSource, on, ...props }) => {
  const [{ opacity }, dragRef] = useDrag({
    item: { type: DraggableImage.DragType, source: dragSource },
    collect: (monitor) => ({
      opacity: monitor.isDragging() ? 0.5 : 1,
    }),
    end: (drag, monitor) => {
      const drop = monitor.getDropResult();
      if (drag && drop) {
        drop.process && drop.process(drag.source);
      }
    },
  });
  return <PreloadedImage ref={dragRef} {...props} style={{ opacity }} />;
};
DraggableImage.DragType = "Image";

DraggableImage.propTypes = {};

export default DraggableImage;

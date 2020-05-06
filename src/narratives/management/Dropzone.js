import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { Grid, makeStyles } from "@material-ui/core";
import { useDrop } from "react-dnd";
import DraggableImage from "components/DraggableImage";
import { useToatser } from "components/Toaster";
import { useAuth } from "services/authentication/Authentication";

const useLocalStyles = makeStyles((theme) => ({
  target: {
    height: 0,
    borderBottom: "1px solid silver",
  },
  active: {
    height: 150,
    border: "1px dashed silver",
  },
  canDrop: {
    height: 10,
    border: "1px dashed silver",
  },
}));
const Dropzone = ({ exhibition, index, onChange }) => {
  const classesLocal = useLocalStyles();
  const { getTokenSilently } = useAuth();
  const { toast } = useToatser();
  const doChange = useCallback(
    async (image) => {
      const token = await getTokenSilently();
      const response = fetch(`/api/management/exhibition/${exhibition.id}`, {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...image, at: index }),
      });
      if (response.status > 399) {
        toast("Das Bild kann nicht eingefügt werden.", "error");
      } else {
        const newExhibition = { ...exhibition, images: [...exhibition.images] };
        newExhibition.images.splice(index, 0, image);
        onChange && onChange(newExhibition);
      }
    },
    [exhibition, index, toast, onChange, getTokenSilently]
  );
  const [{ canDrop, isOver }, dropRef] = useDrop({
    accept: DraggableImage.DragType,
    drop: () => ({ target: exhibition, index, process: doChange }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });
  const isActive = canDrop && isOver;
  let dropClassName = classesLocal.target;
  if (isActive) {
    dropClassName = classesLocal.active;
  } else if (canDrop) {
    dropClassName = classesLocal.canDrop;
  }

  return (
    <Grid item xs={12}>
      <div ref={dropRef} className={dropClassName}></div>
    </Grid>
  );
};

Dropzone.propTypes = {
  exhibition: PropTypes.object,
  index: PropTypes.number,
  onChange: PropTypes.func,
};

export default Dropzone;

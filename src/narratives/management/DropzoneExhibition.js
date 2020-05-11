import React, { useCallback } from "react";
import PropTypes from "prop-types";

import { Grid, Icon, IconButton } from "@material-ui/core";
import PreloadedImage from "components/PreloadedImage";

import Dropzone from "./Dropzone";
import LabelValueList from "components/LabelValueList";
import LabelValue from "components/LabelValue";
import FormatDateTime from "components/FormatDateTime";
import FormatBytes from "components/FormatBytes";
import { useAuth } from "services/authentication/Authentication";
import { useToatser } from "components/Toaster";

const DropzoneExhibition = ({
  height = 200,
  exhibition,
  onChange,
  ...props
}) => {
  const { getTokenSilently } = useAuth();
  const { toast } = useToatser();
  const removeImage = useCallback(
    (image) => {
      return async () => {
        const token = await getTokenSilently();
        const response = await fetch(
          `/api/management/exhibition/${exhibition.id}/${image.id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status > 399) {
          toast("Das Bild konnte nicht entfernt werden.", "error");
        }
        const newExhibition = {
          ...exhibition,
          images: exhibition.images.filter((i) => i.id !== image.id),
        };
        onChange && onChange(newExhibition);
      };
    },
    [exhibition, getTokenSilently, onChange]
  );
  return (
    <Grid container direction="row" spacing={2}>
      <Dropzone exhibition={exhibition} index={0} onChange={onChange} />
      {exhibition &&
        Array.isArray(exhibition.images) &&
        exhibition.images.map((image, index) => (
          <React.Fragment key={image.id}>
            <Grid item xs={5} style={{ height: 150, overflow: "hidden" }}>
              <PreloadedImage
                src={`/api/image/${image.id}`}
                style={{
                  top: "25%",
                  position: "relative",
                  width: "100%",
                  transform: "translateY(-25%)",
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <LabelValueList>
                <LabelValue label="Titel:" value={image.title} />
                <LabelValue label="Author:" value={image.author} />
                <LabelValue
                  label="Erstellt am:"
                  value={<FormatDateTime value={image.originalCreated} />}
                />
                <LabelValue
                  label="Abmessungen:"
                  value={`${image.width}x${image.height}`}
                />
              </LabelValueList>
            </Grid>
            <Grid item xs={1}>
              <IconButton edge="end" onClick={removeImage(image)}>
                <Icon>delete</Icon>
              </IconButton>
            </Grid>
            <Dropzone
              exhibition={exhibition}
              index={index + 1}
              onChange={onChange}
            />
          </React.Fragment>
        ))}
    </Grid>
  );
};

DropzoneExhibition.propTypes = {
  height: PropTypes.number,
  exhibition: PropTypes.object,
  onChange: PropTypes.func,
};

export default DropzoneExhibition;

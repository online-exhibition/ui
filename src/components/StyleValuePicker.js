import React, { useCallback, useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import ColorPicker from "material-ui-color-picker/lib/components/ColorPicker";
import FontPicker from "./FontPicker";

export const StyleProperties = [
  { name: "color", editor: "color-picker" },
  { name: "font-family", editor: "font-picker" },
  { name: "background-color", editor: "color-picker" },
];

function StyleValuePicker({ style, onChange, ...props }) {
  const [editor, setEditor] = useState();
  const [name, setName] = useState((style && style.name) || "");
  const [value, setValue] = useState((style && style.value) || "");

  const onChangeProperty = useCallback(
    ({ target }) => {
      if (target.name === "name") {
        const styleProperty = StyleProperties.find(
          (entry) => entry.name === target.value
        );
        setName(target.value);
        if (styleProperty) {
          setEditor(styleProperty.editor);
          switch (styleProperty.editor) {
            case "color-picker":
              setValue("");
              break;
            case "font-picker":
              setValue("");
              break;
          }
        } else {
          setEditor();
        }
      } else if (target.name === "value" && target.value) {
        setValue(target.value);
      }
    },
    [setName, setEditor]
  );

  useEffect(() => {
    if (name && value) {
      onChange && onChange({ name, value });
    }
  }, [name, value, onChange]);

  useEffect(() => {
    onChangeProperty({
      target: { name: "name", value: (style && style.name) || "" },
    });
    setValue((style && style.value) || "");
  }, [style, setName, setValue, onChangeProperty]);

  return (
    <Grid container direction="row" spacing={1}>
      <Grid item xs={8}>
        <FormControl fullWidth>
          <InputLabel id="theme-select-label">Stil</InputLabel>
          <Select
            labelId="theme-select-label"
            fullWidth
            name="name"
            value={name}
            onChange={onChangeProperty}
            {...props}
          >
            {StyleProperties.map((property) => (
              <MenuItem value={property.name} key={property.name}>
                {property.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={4}>
        {editor === "color-picker" ? (
          <ColorPicker
            TextFieldProps={{
              fullWidth: true,
              label: "Wert",
              name: "value",
              value: value,
            }}
            onChange={(value) =>
              onChangeProperty({ target: { name: "value", value } })
            }
          />
        ) : null}
        {editor === "font-picker" ? (
          <FontPicker
            fullWidth
            fonts={[
              "Roboto",
              "Oswald",
              "Montserrat",
              "Playfair Display",
              "Amatic SC",
              "Josefin Slab",
            ]}
            label="Wert"
            value={value}
            onChange={(value) =>
              onChangeProperty({ target: { name: "value", value } })
            }
          />
        ) : null}
      </Grid>
    </Grid>
  );
}

StyleValuePicker.propTypes = {
  style: PropTypes.shape({ name: PropTypes.string, value: PropTypes.string }),
  onChange: PropTypes.func,
};

export default StyleValuePicker;

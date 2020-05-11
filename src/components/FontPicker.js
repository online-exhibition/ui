import React, { useState } from "react";
import PropTypes from "prop-types";
import { Box, TextField, Menu, MenuItem } from "@material-ui/core";

function FontPicker({ fonts, value, onChange, ...props }) {
  const [anchorEl, setAnchorEl] = useState();
  return (
    <>
      <TextField
        {...props}
        value={value || ""}
        onClick={(event) => setAnchorEl(event.currentTarget)}
      />
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {fonts.map((font) => (
          <MenuItem
            key={font}
            style={{ fontFamily: font }}
            onClick={() => {
              setAnchorEl(null);
              onChange && onChange(font);
            }}
          >
            {font}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

FontPicker.propTypes = {
  fonts: PropTypes.arrayOf(PropTypes.string),
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export default FontPicker;

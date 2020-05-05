import PropTypes from "prop-types";

const FormatAperture = ({ value }) => {
  return `F/${parseFloat(value).toFixed(1)}`;
};

FormatAperture.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default FormatAperture;

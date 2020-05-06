import PropTypes from "prop-types";

export const PropTypeImage = PropTypes.shape({
  id: PropTypes.string.isRequired,
  filename: PropTypes.string,
  author: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  license: PropTypes.string,
  size: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  originalDate: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
});

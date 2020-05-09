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

export const PropTypeExhibition = PropTypes.shape({
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  summary: PropTypes.string,
  description: PropTypes.string,
  maxCount: PropTypes.number,
  start: PropTypes.string,
  expire: PropTypes.string,
  images: PropTypes.arrayOf(PropTypeImage),
  active: PropTypes.bool,
  updated: PropTypes.string,
  created: PropTypes.string,
  modifier: PropTypes.string,
  owner: PropTypes.string,
});

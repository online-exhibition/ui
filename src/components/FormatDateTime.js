import PropTypes from "prop-types";

const FormatDateTime = ({ value, date = true, time = true }) => {
  let dateValue;
  if (value instanceof Date) {
    dateValue = value;
  } else {
    dateValue = new Date(value);
  }
  if (date && !time) {
    return dateValue.toLocaleDateString();
  } else if (!date && time) {
    return dateValue.toLocaleTimeString();
  }
  return `${dateValue.toLocaleDateString()} ${dateValue.toLocaleTimeString()}`;
};

FormatDateTime.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  date: PropTypes.bool,
  time: PropTypes.bool,
};

export default FormatDateTime;

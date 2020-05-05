import PropTypes from "prop-types";

function createExposures() {
  const result = [];
  let step = 60;
  for (let i = 15 * 60; i > 1; i = Math.round((i - step) * 10) / 10) {
    if (i <= 60 && step > 1) {
      step = 1;
    } else if (i <= 30 && step > 1) {
      step = 1;
    } else if (i <= 2 && step > 0.1) {
      step = 0.1;
    }
    result.push({
      label: i.toString(),
      value: i,
    });
  }
  step = 1;
  for (let i = 1; i <= 64000; i = i + step) {
    if (i >= 10 && step < 10) {
      step = 10;
    } else if (i >= 1000 && step < 1000) {
      step = 1000;
    }
    result.push({
      label: "1/" + i,
      value: 1 / i,
    });
  }
  return result;
}

const EXPOSURE_VALUES = createExposures();

const FormatExposure = ({ value }) => {
  const exposure = EXPOSURE_VALUES.find((entry) => entry.value === value);
  if (exposure) {
    return `${exposure.label} s`;
  }
  if (value < 1) {
    return `${value.toFixed(4)} s`;
  }
  return `${value} s`;
};

FormatExposure.propTypes = {
  value: PropTypes.number,
};

export default FormatExposure;

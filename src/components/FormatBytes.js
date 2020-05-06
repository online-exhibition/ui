import PropTypes from "prop-types";

const KIB = 1024;
const MIB = KIB * KIB;
const GIB = KIB * MIB;
const TIB = KIB * GIB;
const PIB = KIB * TIB;
const ZIB = KIB * PIB;
const YIB = KIB * ZIB;

const KB = 1000;
const MB = KB * KB;
const GB = KB * MB;
const TB = KB * GB;
const PB = KB * TB;
const ZB = KB * PB;
const YB = KB * ZB;

function toIEC(value, decimal) {
  if (value > YIB) {
    return (value / YIB).toFixed(decimal) + " YiB";
  } else if (value > ZIB) {
    return (value / ZIB).toFixed(decimal) + " ZiB";
  } else if (value > PIB) {
    return (value / PIB).toFixed(decimal) + " PiB";
  } else if (value > TIB) {
    return (value / TIB).toFixed(decimal) + " TiB";
  } else if (value > GIB) {
    return (value / GIB).toFixed(decimal) + " GiB";
  } else if (value > MIB) {
    return (value / MIB).toFixed(decimal) + " MiB";
  } else if (value > KIB) {
    return (value / KIB).toFixed(decimal) + " KiB";
  }
  return value + " B";
}

function toDefault(value, decimal) {
  if (value > YB) {
    return (value / YB).toFixed(decimal) + " YB";
  } else if (value > ZB) {
    return (value / ZB).toFixed(decimal) + " ZB";
  } else if (value > PB) {
    return (value / PB).toFixed(decimal) + " PB";
  } else if (value > TB) {
    return (value / TB).toFixed(decimal) + " TB";
  } else if (value > GB) {
    return (value / GB).toFixed(decimal) + " GB";
  } else if (value > MB) {
    return (value / MB).toFixed(decimal) + " MB";
  } else if (value > KB) {
    return (value / KB).toFixed(decimal) + " kB";
  }
  return value + " B";
}

const FormatBytes = ({ iec = true, decimal = 2, value }) => {
  if (!value) {
    return "-";
  }
  if (iec) {
    return toIEC(value, decimal);
  }
  return toDefault(value, decimal);
};

FormatBytes.propTypes = {
  value: PropTypes.number.isRequired,
  iec: PropTypes.bool,
  decimal: PropTypes.number,
};

export default FormatBytes;

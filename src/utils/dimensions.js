export function scaleToScreen(
  originalWidth,
  originalHeight,
  top = 0,
  left = 0,
  bottom = 0,
  right = 0
) {
  const ratio = originalWidth / originalHeight;
  const widthOffset = left + right;
  const topOffset = top + bottom;
  let width;
  let height;
  if (ratio > 1) {
    width = window.innerWidth - widthOffset;
    height = width / ratio;
  } else {
    height = window.innerHeight - topOffset;
    width = height / ratio;
  }
  if (height > window.innerHeight - topOffset) {
    height = window.innerHeight - topOffset;
    width = height * ratio;
  } else if (width > window.innerWidth - widthOffset) {
    width = window.innerWidth - widthOffset;
    height = width / ratio;
  }
  return { width, height };
}

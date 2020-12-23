import config from "@/config"
export function createGridBg(size, color, scale) {
  let tmp = size * scale
  while (tmp < config.grid.minGridSize) {
    tmp *= 2
  }
  let tmp2 = config.grid.steps * tmp
  let d = []
  for (let i = 1; i < config.grid.steps; i++) {
    let tmp3 = i * tmp
    d.push(
      "M 0 " +
        tmp3 +
        " L " +
        tmp2 +
        " " +
        tmp3 +
        " M " +
        tmp3 +
        " 0 L " +
        tmp3 +
        " " +
        tmp2
    )
  }
  size = tmp2
  var svg =
    '<svg width="' +
    size +
    '" height="' +
    size +
    '" xmlns="' +
    config.NS_SVG +
    '">' +
    '<defs><pattern id="grid" width="' +
    tmp2 +
    '" height="' +
    tmp2 +
    '" patternUnits="userSpaceOnUse">' +
    '<path d="' +
    d.join(" ") +
    '" fill="none" stroke="' +
    color +
    '" opacity="0.2" stroke-width="1"/>' +
    '<path d="M ' +
    tmp2 +
    " 0 L 0 0 0 " +
    tmp2 +
    '" fill="none" stroke="' +
    color +
    '" stroke-width="1"/>' +
    '</pattern></defs><rect width="100%" height="100%" fill="url(#grid)"/></svg>'
  let image = unescape(encodeURIComponent(svg))
  image = btoa(image)
  image = "url(" + "data:image/svg+xml;base64," + image + ")"
  return image
}

export function createGridBg2(size, color, scale) {
  size = size * scale
  while (size < config.grid.minGridSize) {
    size *= 2
  }
  size = config.grid.steps * size
  let d = []
  for (let i = 1; i < config.grid.steps; i++) {
    let tmp = i * size
    d.push(
      "M 0 " +
        tmp +
        " L " +
        size +
        " " +
        tmp +
        " M " +
        tmp +
        " 0 L " +
        tmp +
        " " +
        size
    )
  }
  const svg =
    '<svg width="' +
    size +
    '" height="' +
    size +
    '" xmlns="' +
    config.NS_SVG +
    '">' +
    '<defs><pattern id="grid" width="' +
    size +
    '" height="' +
    size +
    '" patternUnits="userSpaceOnUse">' +
    '<path d="' +
    d.join(" ") +
    '" fill="none" stroke="' +
    color +
    '" opacity="0.2" stroke-width="1"/>' +
    '<path d="M ' +
    size +
    " 0 L 0 0 0 " +
    size +
    '" fill="none" stroke="' +
    color +
    '" stroke-width="1"/>' +
    '</pattern></defs><rect width="100%" height="100%" fill="url(#grid)"/></svg>'
  let image = unescape(encodeURIComponent(svg))
  image = btoa(image)
  image = "url(" + "data:image/svg+xml;base64," + image + ")"
  return image
}

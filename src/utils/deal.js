import config from "@/config"
/**
 * 获取旋转后的坐标
 * @param {*} left
 * @param {*} top
 * @param {*} width
 * @param {*} height
 */
export const dealRotatePos = ({ rotate, left, top, width, height }) => {
  return transform({ x: left, y: top, width, height }, rotate)
}
function transform(options, angle) {
  const { x, y, width, height } = options
  const r = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)) / 2
  const a = Math.round((Math.atan(height / width) * 180) / Math.PI)
  const tlbra = 180 - angle - a
  const trbla = a - angle
  const topLeft = {
    x: x + width / 2 + r * Math.cos((tlbra * Math.PI) / 180),
    y: y + height / 2 - r * Math.sin((tlbra * Math.PI) / 180)
  }
  const topRight = {
    x: x + width / 2 + r * Math.cos((trbla * Math.PI) / 180),
    y: y + height / 2 - r * Math.sin((trbla * Math.PI) / 180)
  }
  const bottomRight = {
    x: x + width / 2 - r * Math.cos((tlbra * Math.PI) / 180),
    y: y + height / 2 + r * Math.sin((tlbra * Math.PI) / 180)
  }
  const bottomLeft = {
    x: x + width / 2 - r * Math.cos((trbla * Math.PI) / 180),
    y: y + height / 2 + r * Math.sin((trbla * Math.PI) / 180)
  }
  const minX = Math.min(topLeft.x, topRight.x, bottomRight.x, bottomLeft.x)
  const maxX = Math.max(topLeft.x, topRight.x, bottomRight.x, bottomLeft.x)
  const minY = Math.min(topLeft.y, topRight.y, bottomRight.y, bottomLeft.y)
  const maxY = Math.max(topLeft.y, topRight.y, bottomRight.y, bottomLeft.y)
  return {
    point: {
      topLeft,
      topRight,
      bottomLeft,
      bottomRight
    },
    width: maxX - minX,
    height: maxY - minY,
    left: minX,
    right: maxX,
    top: minY,
    bottom: maxY
  }
}
/**
 * 判断当前控件是否是组合
 * @param  widget
 */
export const isGroup = widget => {
  return widget.cname === config.groupName
}

export const findWidgetChildren = (widgetList, widget) => {
  if (!isGroup(widget)) {
    return []
  }
  return widgetList.filter(item => item.pid === widget.cid)
}
/**
 * 当前点击的点是否在控件内部
 */
export const pointIsInWidget = (point, widget, pWidget) => {
  const { x, y } = point
  let { left, top, width, height } = widget.attrs
  if (pWidget) {
    left += pWidget.attrs.left
    top += pWidget.attrs.top
  }
  return x >= left && x <= left + width && y >= top && y <= top + height
}

export const findWidgetById = (widgets, id) => {
  return widgets.find(item => item.cid === id)
}

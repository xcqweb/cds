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

export const findWidgetChildren = (widgetList, cid) => {
  if (!isGroup(findWidgetById(widgetList, cid))) {
    return []
  }
  return widgetList.filter(item => item.pid === cid)
}
/**
 * 当前点击的点是否在控件内部
 */
export const pointIsInWidget = (point, widget) => {
  const { x, y } = point
  let { left, top, width, height } = widget.attrs
  return x >= left && x <= left + width && y >= top && y <= top + height
}
/**
判断当前点击的是哪个子控件
 */
export function clickWhichWidget(widgets, widget, point) {
  let res = null
  const widgetChildren = findWidgetChildren(widgets, widget.cid)
  if (widgetChildren.length) {
    for (let i = 0; i < widgetChildren.length; i++) {
      if (pointIsInWidget(point, widgetChildren[i])) {
        res = widgetChildren[i]
        break
      }
    }
  }
  return res
}
export const findWidgetById = (widgets, id) => {
  return widgets.find(item => item.cid === id)
}
export function dealPageData(data) {
  const { grid, lines, backgroundColor} = config.defaultPage
  return {
    grid: data.grid || grid,
    pageId: data.pageId,
    widgets: [],
    width: data.width,
    height: data.height,
    lines: data.lines || lines,
    sort: data.sort,
    pid: data.pid,
    backgroundColor: data.backgroundColor || backgroundColor,
    backgroundImage: data.backgroundImage,
    pageName: data.pageName,
    isEdit: data.isEdit || false,
    expand: data.expand || false,
    level: data.level || 1,
    isHome: data.isHome
  }
}
export function dealWidgetData(data) {
  let result = []
  const dw = config.defaultWidget
  data.forEach(item => {
    result.push({
      cid: item.widgetId,
      name: item.widgetName,
      cname: item.cname,
      isEdit: item.isEdit,
      copyNum: item.copyNum,
      pid: item.pid,
      active: false,
      text: item.text,
      attrs: {
        width: item.width,
        height: item.height,
        left: item.left,
        top: item.top,
        zIndex: item.zIndex,
        rotate: item.rotate || dw.rotate,
        arrow: item.arrow || dw.arrow,
        linkUrl: item.linkUrl || dw.linkUrl,
        imgSrc: item.imgSrc || dw.imgSrc,
        borderColor: item.borderColor || dw.borderColor,
        borderStyle: item.borderStyle || dw.borderStyle,
        borderWidth: item.borderWidth || dw.borderWidth,
        backgroundColor: item.backgroundColor || dw.backgroundColor,
        backgroundImage: item.backgroundImage || dw.backgroundImage,
        justifyContent: item.justifyContent || dw.justifyContent,
        alignItems: item.alignItems || dw.alignItems,
        fontWeight: item.fontWeight || dw.fontWeight,
        fontSize: item.fontSize || dw.fontSize,
        fontFamily: item.fontFamily || dw.fontFamily,
        opacity: item.opacity || dw.opacity,
        visible: item.visible || dw.visible,
        borderRadius: item.borderRadius || dw.borderRadius,
        color: item.color || dw.color
      }
    })
  })
  return result
}
export function dealDataConfigUrlDev(res) {
  const isDev = process.env.NODE_ENV === "development"
  if (isDev && res) {
    const apiIndex = res.indexOf("/api")
    res = res.substr(apiIndex)
  }
  return res
}

export function findUrl(arr, code, special) {
  // 数据源接口查询
  let res
  const tempObj = arr.find(item => item.functionCode == code)
  if (tempObj) {
    if (special) {
      res = tempObj.dsParamValueUrl
    } else {
      res = tempObj.apiPathUrl
    }
    res = dealDataConfigUrlDev(res)
  }
  return res
}
// 获取首页
export function dealHomePage(pages) {
  if (pages.length > 1) {
    const resIndex = pages.findIndex(item => item.isHome)
    if (resIndex != -1) {
      const temp = pages[resIndex]
      pages.splice(resIndex, 1)
      pages.unshift(temp)
    }
  }
  return pages
}

export function pageWidgetsNum(widgets,cname) {
  return widgets.filter(item=>item.cname === cname).length
}
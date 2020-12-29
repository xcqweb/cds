import config from "@/config"
export const dealWidget = (type, cname) => {
  return config.widgets[type].find(item => item.cname === cname)
}

/**
 * 获取旋转后的坐标
 * @param {*} left 
 * @param {*} top 
 * @param {*} width 
 * @param {*} height 
 */
export const dealRotatePos = (rotate,left,top,width,height) => {
  let x0 = left + width/2 // 矩形中心点
  let y0 = top + height/2
  rotate = rotate * (Math.PI / 180)
  x1 = Math.cos(rotate)*(left-x0) - Math.sin(rotate)*(top-y0) + x0
  y1 = Math.sin(rotate)*(left-x0) + Math.cos(rotate)*(top-y0) + y0
  x2 = Math.cos(rotate)*(left-x0) - Math.sin(rotate)*(top-y0) + x0
  return {
    left:Math.round(left),
    top:Math.round(top),
  }
}
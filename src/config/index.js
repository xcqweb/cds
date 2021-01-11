const grid = {
  color: "#e0e0e0",
  size: 10
}
const defaultPageColor = '#fff'
export default {
  grid: {
    // 网格
    minSize: 4,
    steps: 4,
    ...grid,
  },
  scale: 1, // 页面默认缩放比例
  NS_SVG: "http://www.w3.org/2000/svg",
  widgets: {
    basic: [
      {
        cname: "GtText", // 控件所属组件名称
        name: "文本", // 控件显示名称
        width: 60, // 控件默认宽高
        height: 30
      },
      {
        cname: "GtImage", // 控件所属组件名称
        name: "图片", // 控件显示名称
        width: 60, // 控件默认宽高
        height: 30
      }
    ]
  },
  widgetInitZIndex: 5,
  groupName: "GtGroup",
  defaultPageColor,
  defaultPage:{
    grid: {
      ...grid,
    },
    widgets: [],
    width: 1024,
    height: 768,
    widgetsInfo: {}, // 控件信息
    lines: {
      // 坐标辅助线
      h: [],
      v: []
    },
    sort:0,
    backgroundColor: defaultPageColor
  },
}

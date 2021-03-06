const grid = {
  color: "#e0e0e0",
  size: 10
}
const defaultPageColor = "#fff"
export default {
  navPosition: 0,
  navStyle: 0,
  grid: {
    // 网格
    minSize: 4,
    steps: 4,
    ...grid
  },
  scale: 1, // 页面默认缩放比例
  NS_SVG: "http://www.w3.org/2000/svg",
  widgets: [
    {
      name: "基础组件",
      value: "basic",
      list: [
        {
          cname: "GtText", // 控件所属组件名称
          name: "文本", // 控件显示名称
          width: 60, // 控件默认宽高
          height: 30,
          icon: "widget-text"
        },
        {
          cname: "GtRect",
          name: "矩形",
          width: 130,
          height: 60,
          icon: "widget-rect"
        },
        {
          cname: "GtCircle",
          name: "圆形",
          width: 36,
          height: 36,
          icon: "widget-circle"
        },
        {
          cname: "GtLine",
          name: "直线",
          width: 150,
          height: 1,
          icon: "widget-line"
        },
        {
          cname: "GtLink",
          name: "链接",
          width: 250,
          height: 128,
          icon: "widget-link"
        },
        {
          cname: "GtImage",
          name: "图片",
          width: 200,
          height: 120,
          icon: "widget-image"
        },
        {
          cname: "GtButton",
          name: "按钮",
          width: 80,
          height: 30,
          icon: "widget-button"
        }
      ]
    },
    // {
    //   name: "装饰组件",
    //   value: "decorate",
    //   list: [
    //     {
    //       cname: "GtBorderAnimate1",
    //       name: "边框1",
    //       width: 400,
    //       height: 300,
    //       icon: "widget-image"
    //     },
    //     {
    //       cname: "GtBorderAnimate2",
    //       name: "边框2",
    //       width: 400,
    //       height: 300,
    //       icon: "widget-image"
    //     }
    //   ]
    // },
    {
      name: "图表组件",
      value: "chart",
      list: []
    },
    {
      name: "工业组件",
      value: "industry",
      list: []
    }
  ],
  widgetInitZIndex: 5,
  groupName: "GtGroup",
  defaultPageColor,
  defaultPage: {
    grid: {
      ...grid
    },
    widgets: [],
    width: 1366,
    height: 768,
    lines: {
      // 坐标辅助线
      h: [],
      v: []
    },
    sort: 0,
    backgroundColor: defaultPageColor,
    backgroundImage: null
  },
  defaultWidget: {
    rotate: 0,
    arrow: "empty",
    linkUrl: "",
    imgSrc: "",
    borderColor: "",
    borderStyle: "solid",
    borderWidth: 1,
    backgroundColor: "",
    backgroundImage: "",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: false,
    fontSize: 12,
    fontFamily: "PingFangSC-Regular",
    opacity: 1,
    visible: true,
    borderRadius: 0,
    color: "#040c2c"
  },
  eventList: [
    { label: "点击", value: "click" },
    { label: "双击", value: "dbclick" },
    { label: "左滑", value: "touchLeft" },
    { label: "右滑", value: "touchRight" },
    { label: "上滑", value: "touchTop" },
    { label: "下滑", value: "touchBottom" }
  ],
  actionList: [
    { label: "跳转页面", value: "link-page" },
    { label: "显隐组件", value: "show-hide-widget" },
    { label: "打开链接", value: "open-link" }
  ],
  openListWayList: [
    { label: "当前页打开", value: "_self" },
    { label: "新窗口打开", value: "_blank" }
  ],
  navColorList: [
    { label: "#1740DC", value: 1 },
    { label: "#F5222D", value: 2 },
    { label: "#F9531C", value: 3 },
    { label: "#EB2F96", value: 4 },
    { label: "#722ED1", value: 5 },
    { label: "#13C2C2", value: 6 }
  ],
  navList: [
    { label: "亮色", value: "light" },
    { label: "暗色", value: "dark" }
  ],
  editableWidetList: ["GtText", "GtRect", "GtCircle", "GtButton"]
}

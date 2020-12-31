export default {
  // 应用全局常量配置
  grid: {
    // 网格
    minSize: 4,
    color: "#e0e0e0",
    steps: 4,
    size: 10
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
  menuList: [
    {
      label: "复制",
      command: "$copy",
      operate: "ctrl + c"
    },
    {
      label: "剪切",
      command: "$cut",
      operate: "ctrl + x"
    },
    {
      label: "粘贴",
      command: "$paste",
      operate: "ctrl + v"
    },
    {
      label: "置顶",
      command: "$moveToTop",
      operate: ""
    },
    {
      label: "上移一层",
      command: "$moveToUpper",
      operate: ""
    },
    {
      label: "下移一层",
      command: "$moveToLower",
      operate: ""
    },
    {
      label: "置底",
      command: "$moveToBottom",
      operate: ""
    },
    {
      label: "添加到组件库",
      command: "$addToTemplate",
      operate: ""
    },
    {
      label: "删除",
      command: "$remove",
      operate: "del"
    }
  ],
  widgetInitZIndex: 5
}

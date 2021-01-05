import Vue from "vue"
import Vuex from "vuex"
import moduleGetters from "./getters"
import config from "@/config"
import { uuid } from "@u/uuid"
Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    apply: {
      pages: [
        {
          id: "p1",
          grid: {
            size: config.grid.size, //默认值，可逐步增加
            color: config.grid.color,
            enable: true
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
          backgroundColor: "#fff",
        }
      ],
      scale: config.scale,
      width: 1024,
      height: 768
    },
    currentPageId: "p1", // 当前页面id
    delWidgets: [], // 当前页面删除的控件
    ruler: {
      // 刻度尺
      cornerActive: false,
      startPos: { x: 0, y: 0 },
      shadow: { x: 0, y: 0, width: 0, height: 0 },
      width: 0,
      height: 0
    },
    widgets: config.widgets, // 左侧组件区域
    isShowSelection: false, // 是否显示框选，
    menuList: config.menuList //右键菜单，
  },
  mutations: {
    setGridSize(state, data) {
      // 设置grid大小
      let currentPage = this.getters.currentPage
      currentPage.grid.size = data
    },
    setGridColor(state, data) {
      // 设置grid颜色
      let currentPage = this.getters.currentPage
      currentPage.grid.color = data
    },
    setRulerCornerActive(state, data) {
      // 设置标尺左上角的状态
      state.ruler.cornerActive = data
    },
    setRulerStartPos(state, data) {
      state.ruler.startPos = data
    },
    setRulerShadow(state, data) {
      // 设置标尺横轴、竖轴选中范围
      state.ruler.shadow = data
    },
    setRulerSize(state, data) {
      state.ruler.width = data.width
      state.ruler.height = data.height
    },
    setLines(state, data) {
      // 设置每个页面刻度尺的辅助线
      let currentPage = this.getters.currentPage
      currentPage.lines = data
    },
    setCurrentPageId(state, data) {
      // 设置当前页
      state.currentPageId = data
    },
    setCurrentWidgetId(state, data) {
      // 设置当前控件id
      state.currentWidgetId = data
    },
    /****************控件样式设置start*************/
    setCurrentContent(state, data){ //设置当前文本内容
      let currentWidget = this.getters.currentWidget
      currentWidget.attrs.text = data
    },
    setName(state, data){ //设置控件名称
      let currentWidget = this.getters.currentWidget
      currentWidget.name = data
    },
    setLeft(state, data){ // 设置控件left
      let currentWidget = this.getters.currentWidget
      currentWidget.attrs.left = data
    },
    setTop(state, data){ // 设置控件top
      let currentWidget = this.getters.currentWidget
      currentWidget.attrs.top = data
      console.log(data)
    },
    setWidth(state, data){ // 设置控件width
      let currentWidget = this.getters.currentWidget
      currentWidget.attrs.width = data
    },
    setHeight(state, data){ // 设置控件height
      let currentWidget = this.getters.currentWidget
      currentWidget.attrs.height = data
    },

    /****************控件样式设置end*************/
    widgetAdd(state, data) {
      let { cid, name, cname, dname, left, top, width, height, rotate, zIndex } = data
      let currentPage = this.getters.currentPage
      let widgetNum = currentPage.widgetsInfo[cname] || 0
      currentPage.widgetsInfo[cname] = ++widgetNum
      cid = cid || `w${uuid(16, 16)}`
      zIndex = zIndex || currentPage.widgets.length + config.widgetInitZIndex
      let widget = {
        cid,
        pid:'',
        cname,
        name: dname || `${name} ${widgetNum === 1 ? "" : widgetNum}`,
        isEdit: true,
        copyNum: 0,
        active: true, // 激活当前控件
        attrs: {
          width,
          height,
          left,
          top,
          rotate: rotate || 0,
          zIndex,
          text:'输入文本',// 显示文本
        }
      }
      currentPage.widgets.push(widget)
    },
    updateWidgetAttrs(state, attrs) {
      const currentWidget = this.getters.currentWidget
      const currentWidgetIndex = this.getters.currentWidgetIndex
      const currentPage = this.getters.currentPage
      if (currentWidget) {
        const resAttrs = { ...currentWidget.attrs, ...attrs }
        currentWidget.attrs = resAttrs
        currentPage.widgets.splice(currentWidgetIndex, 1, { ...currentWidget })
      }
    },
    updateWidgetAttrsPatch(state,attrs) {
      const selectWidgets = this.getters.selectWidgets
      const currentPage = this.getters.currentPage
      selectWidgets.forEach(item=>{
        let resIndex = currentPage.widgets.findIndex(w=>w.cid==item.cid)
        let resAttrs = {...item.attrs,...attrs}
        item.attrs = resAttrs
        currentPage.widgets.splice(resIndex, 1, { ...item })
      })
    },
    updateWidget(state, data) {
      const currentWidget = this.getters.currentWidget
      const currentWidgetIndex = this.getters.currentWidgetIndex
      const currentPage = this.getters.currentPage
      if (currentWidget) {
        currentPage.widgets.splice(currentWidgetIndex, 1, {
          ...currentWidget,
          ...data
        })
      }
    },
    updateWidgetPatch(state,data) {
      const selectWidgets = this.getters.selectWidgets
      const currentPage = this.getters.currentPage
      selectWidgets.forEach(item=>{
        let resIndex = currentPage.widgets.findIndex(w=>w.cid==item.cid)
        currentPage.widgets.splice(resIndex, 1, { ...item,...data})
      })
    },
    widgetDel() {
      const currentPage = this.getters.currentPage
      const currentWidgetIndex = this.getters.currentWidgetIndex
      currentPage.widgets.splice(currentWidgetIndex, 1)
    },
    setIsShowSelection(state, data) {
      state.isShowSelection = data
    }
  },
  actions: {
    addPage() {
      // 请求后端接口，创建应用新页面
    }
  },
  modules: {},
  getters: {
    currentWidgetId: (state,getters) => {
      let widgetId = ''
      const currentWidget = getters.currentPage.widgets.find(item=>item.active)
      if(currentWidget) {
        widgetId = currentWidget.cid
      }
      return widgetId
    },
    currentPageIndex: state => {
      let { apply, currentPageId } = state
      return apply.pages.findIndex(item => item.id == currentPageId)
    },
    currentPage: ({ apply }, getters) => {
      return apply.pages[getters.currentPageIndex]
    },
    currentWidget: (state, getters) => {
      return getters.currentPage.widgets.find(
        item => item.cid === getters.currentWidgetId
      )
    },
    currentWidgetIndex: (state, getters) => {
      return getters.currentPage.widgets.findIndex(
        item => item.cid === getters.currentWidgetId
      )
    },
    selectWidgets: (state, getters) => {
      return getters.currentPage.widgets.filter(item => item.active)
    },
    ...moduleGetters
  }
})

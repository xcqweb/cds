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
          zIndex: 1
        }
      ],
      scale: config.scale,
      width: 1024,
      height: 768
    },
    currentPageId: "p1", // 当前页面id
    currentWidgetId: "", // 当前选中组件id
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
    hint: {}, // 控件提示信息
    selection: {}, // 框选组件阴影
    showHelpLine: false // 是否显示辅助线
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
    setHint(state, data) {
      // 设置提示信息
      state.hint = data
    },
    setSelection(state, data) {
      state.selection = data
    },
    setShowHelpLine(state, data) {
      state.showHelpLine = data
    },
    widgetAdd(state, data) {
      const { name, cname, dname, left, top, width, height } = data
      let currentPage = this.getters.currentPage
      let widgetNum = currentPage.widgetsInfo[cname] || 0
      currentPage.widgetsInfo[cname] = ++widgetNum
      const cid = `w${uuid(16, 16)}`
      let widget = {
        cid,
        cname,
        name: dname || `${name} ${widgetNum}`,
        isEdit: true,
        attrs: {
          width,
          height,
          left,
          top,
          rotate: 0
        }
      }
      currentPage.widgets.push(widget)
      this.commit("setCurrentWidgetId", cid)
    },
    updateWidget(state, attrs) {
      const currentWidget = this.getters.currentWidget
      const currentWidgetIndex = this.getters.currentWidgetIndex
      const currentPage = this.getters.currentPage
      if (currentWidget) {
        const resAttrs = { ...currentWidget.attrs, ...attrs }
        currentWidget.attrs = resAttrs
        currentPage.widgets.splice(currentWidgetIndex, 1, { ...currentWidget })
      }
    }
  },
  actions: {
    addPage() {
      // 请求后端接口，创建应用新页面
    }
  },
  modules: {},
  getters: {
    currentPageIndex: state => {
      let { apply, currentPageId } = state
      return apply.pages.findIndex(item => item.id == currentPageId)
    },
    currentPage: ({ apply }, getters) => {
      return apply.pages[getters.currentPageIndex]
    },
    currentWidget: ({ currentWidgetId }, getters) => {
      return getters.currentPage.widgets.find(
        item => item.cid === currentWidgetId
      )
    },
    currentWidgetIndex: ({ currentWidgetId }, getters) => {
      return getters.currentPage.widgets.findIndex(
        item => item.cid === currentWidgetId
      )
    },
    ...moduleGetters
  }
})

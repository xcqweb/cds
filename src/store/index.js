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
          backgroundColor: "#fff"
        }
      ],
      scale: config.scale,
      width: 1024,
      height: 768
    },
    currentPageId: "p1", // 当前页面id
    currentWidgetId: "", // 当前激活的控件
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
    setGrid(state, data) {
      // 设置grid
      let currentPage = this.getters.currentPage
      const tempGrid = { ...currentPage.grid, ...data }
      currentPage.grid = tempGrid
    },
    setRuler(state, data) {
      // 设置标尺
      const tempRuler = { ...state.ruler, ...data }
      state.ruler = tempRuler
    },
    setCurrentPageInfo(state, data) {
      // 设置当前页面信息
      let currentPage = this.getters.currentPage
      currentPage = { ...currentPage, ...data }
    },
    setCurrentPageId(state, data) {
      // 设置当前页
      state.currentPageId = data
    },
    setCurrentWidgetId(state, data) {
      // 设置当前控件id
      state.currentWidgetId = data
    },
    widgetAdd(state, data) {
      let {
        cid,
        name,
        cname,
        dname,
        left,
        top,
        width,
        height,
        rotate,
        zIndex
      } = data
      let currentPage = this.getters.currentPage
      let widgetNum = currentPage.widgetsInfo[cname] || 0
      currentPage.widgetsInfo[cname] = ++widgetNum
      cid = cid || `${uuid(16, 16)}`
      zIndex = zIndex || currentPage.widgets.length + config.widgetInitZIndex
      let widget = {
        cid,
        pid: "",
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
          text: "", // 显示文本
          content: "默认文本333"
        }
      }
      const currentWidgetIndex = this.getters.currentWidgetIndex
      if (currentWidgetIndex !== -1) {
        // 连续拖拽时候 取消之前激活的控件
        let currentWidget = this.getters.currentWidget
        currentWidget.active = false
        currentPage.widgets.splice(currentWidgetIndex, 1, { ...currentWidget })
      }
      currentPage.widgets.push(widget)
      state.currentWidgetId = cid
      state.ruler.shadow = { x: left, y: top, width, height }
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
    updateWidgetAttrsPatch(state, attrs) {
      const selectWidgets = this.getters.selectWidgets
      const currentPage = this.getters.currentPage
      selectWidgets.forEach(item => {
        let resIndex = currentPage.widgets.findIndex(w => w.cid == item.cid)
        let resAttrs = { ...item.attrs, ...attrs }
        if (resAttrs.disLeft || resAttrs.disTop) {
          resAttrs.left -= resAttrs.disLeft
          resAttrs.top -= resAttrs.disTop
        }
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
    updateWidgetPatch(state, data) {
      const selectWidgets = this.getters.selectWidgets
      const currentPage = this.getters.currentPage
      selectWidgets.forEach(item => {
        let resIndex = currentPage.widgets.findIndex(w => w.cid == item.cid)
        currentPage.widgets.splice(resIndex, 1, { ...item, ...data })
      })
    },
    widgetDel() {
      const currentPage = this.getters.currentPage
      const currentWidgetIndex = this.getters.currentWidgetIndex
      if (currentPageIndex != -1) {
        currentPage.widgets.splice(currentWidgetIndex, 1)
      }
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
    currentPageIndex: state => {
      let { apply, currentPageId } = state
      return apply.pages.findIndex(item => item.id == currentPageId)
    },
    currentPage: ({ apply }, getters) => {
      return apply.pages[getters.currentPageIndex]
    },
    currentWidget: (state, getters) => {
      return getters.currentPage.widgets.find(
        item => item.cid === state.currentWidgetId
      )
    },
    currentWidgetIndex: (state, getters) => {
      let res = getters.currentPage.widgets.findIndex(
        item => item.cid === state.currentWidgetId
      )
      return res
    },
    selectWidgets: (state, getters) => {
      return getters.currentPage.widgets.filter(item => item.active)
    },
    ...moduleGetters
  }
})

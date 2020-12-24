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
    currentWidgetId: ["w1"], // 当前选中组件id
    delWidgets: [], // 当前页面删除的控件
    ruler: {
      // 刻度尺
      cornerActive: false,
      startPos: { x: 0, y: 0 },
      shadow: { x: 0, y: 0, width: 0, height: 0 },
      width: 0,
      height: 0
    },
    widgets: {
      // 组件区域
      basic: [
        // 基本组件
        {
          cname: "GtText", // 控件所属组件名称
          name: "文本" // 控件显示名称
        }
      ]
    }
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
    widgetAdd(state, data) {
      const { name, cname, dname, left, top} = data
      let currentPage = this.getters.currentPage
      let wigetNum = currentPage.widgetsInfo[cname] || 0
      wigetNum++
      let widget = {
        cid: `w${uuid(16, 16)}`,
        cname,
        name: dname || `${name} ${wigetNum}`,
        isEdit: true,
        attrs: {
          left: `${left}px`,
          top: `${top}px`
        }
      }
      currentPage.widgets.push(widget)
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
    ...moduleGetters
  }
})

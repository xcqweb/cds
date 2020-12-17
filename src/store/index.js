import Vue from "vue"
import Vuex from "vuex"
import moduleGetters from "./getters"
import config from "@/config"
Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    apply: {
      pages: [
        {
          id: "p1",
          grid: {
            size: config.grid.size, //默认值，可逐步增加
            color: config.grid.color
          },
          widgets:[{
            width:220,
            height:220,
            x:20,
            y:30,
            id:'xxx',
            pid:'0'
          }],
          width: 1024,
          height: 768
        }
      ],
      scale: config.scale,
      width: 1024,
      height: 768
    },
    currentPageId: "p1",
    ruler: {
      cornerActive: false,
      startPos: { x: 0, y: 0 },
      shadow: { x: 0, y: 0, width: 0, height: 0 },
      width: 0,
      height: 0
    }
  },
  mutations: {
    setGridSize(state, data) { // 设置grid大小
      let currentPage = this.getters.currentPage
      currentPage.grid.size = data
    },
    setGridColor(state, data) {// 设置grid颜色
      let currentPage = this.getters.currentPage
      currentPage.grid.color = data
    },
    setRulerCornerActive(state, data) {// 设置标尺左上角的状态
      state.ruler.cornerActive = data
    },
    setRulerStartPos(state, data) {
      state.ruler.startPos = data
    },
    setRulerShadow(state, data) {// 设置标尺横轴、竖轴选中范围
      state.ruler.shadow = data
    },
    setRulerSize(state, data) {
      state.ruler.width = data.width
      state.ruler.height = data.height
    },
  },
  actions: {},
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

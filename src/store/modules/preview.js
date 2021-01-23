export default {
  namespaced: true,
  state: {
    apply: [],
    pages: [],
    currentPage: [],
    frameContent: { texts: null, show: false, pos: { x: -200, y: -200 } } //是否显示浮窗
  },
  mutations: {
    setPages(state, data) {
      state.pages = data
    },
    setCurrentPage(state, data) {
      state.currentPage = data
    },
    setApply(state, data) {
      state.apply = data
    },
    setFrameContent(state, data) {
      let res = state.frameContent
      state.frameContent = { ...res, ...data }
    }
  }
}

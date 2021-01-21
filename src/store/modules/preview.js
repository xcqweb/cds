export default {
  namespaced: true,
  state: {
    apply: [],
    pages: [],
    currentPage: []
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
    }
  }
}

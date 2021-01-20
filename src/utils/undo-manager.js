import Vue from "vue"
import VuexHistory from "vuex-history"
import store from "@/store"
Vue.use(VuexHistory)
const watchStateNames = ["apply"]
const maxHistoryLength = 50
const vuexHistory = new VuexHistory(store, watchStateNames, maxHistoryLength)
export default {
  saveApplyChange() {
    // 存储当前应用数据的变化
    vuexHistory.saveSnapshot()
  },
  applyUndo() {
    if (vuexHistory.canUndo) {
      vuexHistory.undo()
    }
  },
  applyRedo() {
    if (vuexHistory.canRedo) {
      vuexHistory.redo()
    }
  },
  clearHistory() {
    vuexHistory.clearHistory()
  },
}

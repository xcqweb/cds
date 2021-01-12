import Vue from "vue"
import Vuex from "vuex"
import moduleGetters from "./getters"
import config from "@/config"
import { uuid } from "@u/uuid"
import appApi from "@a/apply"
import pageApi from "@a/page"
import widgetApi from "@a/widget"
import { cloneDeep } from "lodash"
Vue.use(Vuex)
function dealPageData(data) {
  return {
    grid: data.grid,
    pageId: data.pageId,
    widgets: [],
    width: data.width,
    height: data.height,
    widgetsInfo: data.widgetsInfo,
    lines: data.lines,
    sort: data.sort,
    backgroundColor: data.backgroundColor || config.defaultPageColor
  }
}
export default new Vuex.Store({
  state: {
    isApplyInit: false, // 应用是否初始化成功
    apply: {
      pages: []
    },
    currentPageId: "", // 当前页面id
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
    isShowSelection: false, // 是否显示框选,
    groupSelection: { show: false, widget: {} },
    showHelpLine: false, // 辅助线
    hint: { show: false, text: "" } // 提示信息
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
    addPage(state, data) {
      state.apply.pages.push(data)
    },
    setCurrentPageWidgets(state, data) {
      // 设置当前页面信息
      const currentPage = this.getters.currentPage
      currentPage.widgets = data
    },
    setCurrentPageId(state, data) {
      // 设置当前页
      state.currentPageId = data
    },
    setCurrentWidgetId(state, data) {
      // 设置当前控件id
      state.currentWidgetId = data
    },
    setDelWidgets(state, data) {
      // 设置删除的控件
      state.delWidgets = data
    },
    setGroupSelection(state, data) {
      state.groupSelection = data
      if (!state.currentWidgetId) {
        state.currentWidgetId = data.widget.cid
      }
    },
    setShowHelpLine(state, data) {
      state.showHelpLine = data
    },
    setHint(state, data) {
      state.hint = data
    },
    setIsApplyInit(state, data) {
      state.isApplyInit = data
    },
    setApply(state, data) {
      state.apply = { ...state.apply, ...data }
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
          zIndex
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
      let currentWidget = this.getters.currentWidget
      const currentPage = this.getters.currentPage
      if (attrs.cid) {
        currentWidget = currentPage.widgets.find(item => item.cid == attrs.cid)
      }
      delete attrs.cid
      if (currentWidget) {
        const currentWidgetIndex = currentPage.widgets.findIndex(
          item => item.cid == currentWidget.cid
        )
        const resAttrs = { ...currentWidget.attrs, ...attrs }
        currentWidget.attrs = resAttrs
        currentWidget.isEdit = true
        currentPage.widgets.splice(currentWidgetIndex, 1, { ...currentWidget })
      }
    },
    updateWidgetAttrsPatch(state, attrs) {
      const selectWidgets = this.getters.selectWidgets
      const currentPage = this.getters.currentPage
      selectWidgets.forEach(item => {
        let resIndex = currentPage.widgets.findIndex(w => w.cid == item.cid)
        let resAttrs = { ...item.attrs, ...attrs }
        item.attrs = resAttrs
        item.isEdit = true
        currentPage.widgets.splice(resIndex, 1, { ...item })
      })
    },
    updateWidget(state, data) {
      let currentWidget = this.getters.currentWidget
      const currentPage = this.getters.currentPage
      if (data.cid) {
        currentWidget = currentPage.widgets.find(item => item.cid == data.cid)
      }
      const currentWidgetIndex = currentPage.widgets.findIndex(
        item => item.cid == currentWidget.cid
      )
      if (currentWidget) {
        currentPage.widgets.splice(currentWidgetIndex, 1, {
          ...currentWidget,
          ...data,
          isEdit: true
        })
      }
    },
    updateWidgetPatch(state, data) {
      const selectWidgets = this.getters.selectWidgets
      const currentPage = this.getters.currentPage
      selectWidgets.forEach(item => {
        let resIndex = currentPage.widgets.findIndex(w => w.cid == item.cid)
        currentPage.widgets.splice(resIndex, 1, {
          ...item,
          ...data,
          isEdit: true
        })
      })
    },
    updatePageAllWidgets(state, data) {
      // 更新画布上所有控件的信息
      const currentPage = this.getters.currentPage
      currentPage.widgets.forEach((item, index) => {
        currentPage.widgets.splice(index, 1, { ...item, ...data, isEdit: true })
      })
    },
    widgetDel(state, widgets) {
      if (!widgets) {
        widgets = this.getters.selectWidgets
      }
      const currentPage = this.getters.currentPage
      widgets.forEach(item => {
        let currentWidgetIndex = currentPage.widgets.findIndex(
          w => w.cid == item.cid
        )
        state.delWidgets.push(item)
        if (currentWidgetIndex != -1) {
          currentPage.widgets.splice(currentWidgetIndex, 1)
        }
      })
    },
    setIsShowSelection(state, data) {
      state.isShowSelection = data
    }
  },
  actions: {
    updateGroupSelection(store, data) {
      store.commit("updateWidget", { active: true, cid: data.widget.cid })
      store.commit("setGroupSelection", data)
    },
    initApply(store, applyId) {
      store.dispatch("queryApply", applyId)
      store.dispatch("queryAllPage", { applyId })
    },
    queryApply(store, id) {
      appApi.query(id).then(res => {
        if (res.code === 0) {
          const { data } = res
          store.commit("setApply", {
            scale: +data.scale || config.scale,
            width: +data.width,
            height: +data.height
          })
        }
      })
    },
    queryAllPage(store, data) {
      pageApi.queryAll(data).then(res => {
        if (res.code === 0) {
          if (res.data.length) {
            const pageId = res.data[0].pageId
            store.commit("setCurrentPageId", pageId)
            store.dispatch("queryPage", pageId)
          } else {
            store.dispatch("addPage",data.applyId)
          }
        }
      })
    },
    addPage(store, appId) {
      const params = {
        appId,
        ...config.defaultPage
      }
      pageApi.add(params).then(res => {
        if (res.code === 0) {
          store.commit("addPage", dealPageData(res.data))
          store.dispatch('queryPage',res.data.pageId)
        }
      })
    },
    queryPage(store, pageId) {
      pageApi.query(pageId).then(res => {
        if (res.code === 0) {
          store.commit("addPage", dealPageData(res.data))
          store.dispatch("queryWidgets", pageId)
          store.commit("setIsApplyInit", true)
        }
      })
    },
    queryWidgets(store, pageId) {
      widgetApi.queryAll({ pageId }).then(res => {
        if (res.code === 0) {
          const { data } = res
          let widgets = []
          if (data.length) {
            data.forEach(item => {
              widgets.push({
                cid: item.widgetId,
                name: item.widgetName,
                cname: item.cname,
                isEdit: item.isEdit,
                copyNum: item.copyNum,
                pid: item.pid,
                active: false,
                attrs: {
                  width: item.width,
                  height: item.height,
                  left: item.left,
                  top: item.top,
                  rotate: item.rotate,
                  zIndex: item.zIndex
                }
              })
            })
          }
          store.commit("setCurrentPageWidgets", widgets)
        }
      })
    },
    patchModifyWidgets(store) {
      const widgets = store.getters.currentPage.widgets
      let params = cloneDeep(widgets)
      params = params.filter(item => item.isEdit)
      params = params.map(item => {
        return {
          cname: item.cname,
          copyNum: item.copyNum,
          isEdit: false,
          pageId: store.state.currentPageId,
          pid: item.pid,
          widgetId: item.cid,
          widgetName: item.name,
          ...item.attrs
        }
      })
      const delWidgets = store.state.delWidgets
      const delIds = delWidgets.map(item => item.cid)
      if (delIds.length) {
        store.dispatch("patchDelWidgets", delIds)
      }
      if (params.length) {
        widgetApi.modifyPatch(params).then(res => {
          if (res.code === 0) {
            console.log("保存成功")
          }
        })
      }
    },
    patchDelWidgets(store, data) {
      widgetApi.delPatch(data.join(",")).then(res => {
        if (res.code === 0) {
          console.log("删除成功")
          store.commit("setDelWidgets", [])
        }
      })
    }
  },
  modules: {},
  getters: {
    currentPageIndex: state => {
      let { apply, currentPageId } = state
      let resIndex = apply.pages.findIndex(item => item.id == currentPageId)
      if (resIndex == -1) {
        resIndex = 0
      }
      return resIndex
    },
    currentPage: ({ apply }, getters) => {
      if (getters.currentPageIndex != -1) {
        return apply.pages[getters.currentPageIndex]
      }
      return
    },
    currentWidget: (state, getters) => {
      const currentPage = getters.currentPage
      if (currentPage) {
        return currentPage.widgets.find(
          item => item.cid === state.currentWidgetId
        )
      }
      return {}
    },
    currentWidgetIndex: (state, getters) => {
      const currentPage = getters.currentPage
      let res = -1
      if (currentPage) {
        res = currentPage.widgets.findIndex(
          item => item.cid === state.currentWidgetId
        )
      }
      return res
    },
    selectWidgets: (state, getters) => {
      if (getters.currentPage) {
        return getters.currentPage.widgets.filter(item => item.active)
      }
      return []
    },
    ...moduleGetters
  }
})

import Vue from "vue"
import Vuex from "vuex"
import moduleGetters from "./getters"
import config from "@/config"
import { uuid } from "@u/uuid"
import appApi from "@a/apply"
import pageApi from "@a/page"
import widgetApi from "@a/widget"
import { cloneDeep } from "lodash"
import { dealPageData, dealWidgetData } from "@u/deal"
Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    apply: {
      pages: []
    },
    currentPageId: "", // 当前页面id
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
    hint: { show: false, text: "" }, // 提示信息
    saveTime: new Date(),
    textEditorShow: { show: false, cid: "" } //显示文本编辑器
  },
  mutations: {
    setRuler(state, data) {
      // 设置标尺
      const tempRuler = { ...state.ruler, ...data }
      state.ruler = tempRuler
    },
    setSaveTime(state, data) {
      state.saveTime = data
    },
    setTextEditorShow(state, data) {
      const tempObj = state.textEditorShow
      state.textEditorShow = { ...tempObj, ...data }
    },
    addPage(state, data) {
      if (data.pid) {
        const resIndex = state.apply.pages.findIndex(
          item => item.pageId == data.pid
        )
        if (resIndex != -1) {
          const tempPage = state.apply.pages[resIndex]
          state.apply.pages.splice(resIndex, 1, { ...tempPage, expand: true })
        }
      }
      state.apply.pages.push(dealPageData(data))
    },
    delPage(state, data) {
      const resIndex = state.apply.pages.findIndex(item => item.pageId == data)
      if (resIndex != -1) {
        state.apply.pages.splice(resIndex, 1)
      }
    },
    setHomePage(state, data) {
      const resIndex = state.apply.pages.findIndex(item => item.pageId == data)
      if (resIndex != -1) {
        const tempPage = state.apply.pages[resIndex]
        state.apply.pages.splice(resIndex, 1)
        state.apply.pages.unshift(tempPage)
      }
    },
    initPages(state, data) {
      data = data.map(item => {
        return dealPageData(item)
      })
      state.apply.pages = data
    },
    setPageInfo(state, data) {
      let page = this.getters.currentPage
      if (data.pageId) {
        page = state.apply.pages.find(item => item.pageId === data.pageId)
      }
      const pageIndex = state.apply.pages.findIndex(
        item => item.pageId === page.pageId
      )
      if (data.newPageId) {
        // 更新pageId
        state.currentPageId = data.newPageId
        data.pageId = data.newPageId
        delete data.newPageId
      }
      state.apply.pages.splice(pageIndex, 1, { ...page, ...data })
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
    setDelWidgets(state, data) {
      // 设置删除的控件
      state.delWidgets = data
    },
    setGroupSelection(state, data) {
      state.groupSelection = data
    },
    setShowHelpLine(state, data) {
      state.showHelpLine = data
    },
    setHint(state, data) {
      state.hint = data
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
          ...config.defaultWidget,
          width,
          height,
          left,
          top,
          rotate: rotate || 0,
          zIndex
        }
      }
      currentPage.widgets.push(widget)
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
    async initApply(store, applyId) {
      store.dispatch("queryApply", applyId)
      const allPage = await pageApi.queryAll({ applyId })
      return new Promise(resolve => {
        const { pageId } = allPage.data[0] // 首页
        const p1 = pageApi.query(pageId)
        const p2 = widgetApi.queryAll({ pageId })
        Promise.all([p1, p2]).then(res => {
          const widgetData = res[1].data
          store.commit("initPages", allPage.data)
          store.commit("setCurrentPageId", pageId)
          store.commit("setCurrentPageWidgets", dealWidgetData(widgetData))
          resolve()
        })
      })
    },
    queryApply(store, id) {
      appApi.query(id).then(res => {
        if (res.code === 0) {
          const { data } = res
          store.commit("setApply", {
            scale: +data.scale || config.scale,
            width: +data.width,
            height: +data.height,
            studioName: data.studioName,
            gridEnable: data.gridEnable || 1,
            ruleEnable: data.ruleEnable || 1,
            id: data.id
          })
        }
      })
    },
    patchModifyWidgets(store, isNoTip) {
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
            store.commit("setSaveTime", new Date())
            if (!isNoTip) {
              console.log("保存页面的控件成功")
            }
          }
        })
      }
    },
    patchDelWidgets(store, data) {
      widgetApi.delPatch(data.join(",")).then(res => {
        if (res.code === 0) {
          console.log("删除控件成功")
          store.commit("setDelWidgets", [])
        }
      })
    },
    updateApply(store, data) {
      const params = { id: store.state.apply.id, ...data }
      store.commit("setApply", data)
      appApi.edit(params).then(res => {
        if (res.code === 0) {
          console.log("保存应用成功")
        }
      })
    },
    updatePageInfo(store, data) {
      const params = { pageId: store.state.currentPageId, ...data }
      store.commit("setPageInfo", data)
      pageApi.modify(params).then(res => {
        if (res.code === 0) {
          console.log("修改页面成功")
        }
      })
    }
  },
  modules: {},
  getters: {
    currentPageIndex: state => {
      let { apply, currentPageId } = state
      let resIndex = apply.pages.findIndex(item => item.pageId == currentPageId)
      if (resIndex == -1) {
        resIndex = 0
      }
      return resIndex
    },
    currentPage: ({ apply }, getters) => {
      if (getters.currentPageIndex != -1) {
        return apply.pages[getters.currentPageIndex]
      }
      return null
    },
    selectWidgets: (state, getters) => {
      if (getters.currentPage) {
        return getters.currentPage.widgets.filter(item => item.active)
      }
      return []
    },
    currentWidget: (state, getters) => {
      const selectWidgets = getters.selectWidgets
      if (selectWidgets.length) {
        return selectWidgets[0]
      }
      return null
    },
    currentWidgetId: (state, getters) => {
      if (getters.currentWidget) {
        return getters.currentWidget.cid
      }
      return null
    },
    currentWidgetIndex: (state, getters) => {
      const currentPage = getters.currentPage
      let res = -1
      if (currentPage) {
        res = currentPage.widgets.findIndex(
          item => item.cid === getters.currentWidgetId
        )
      }
      return res
    },
    ...moduleGetters
  }
})

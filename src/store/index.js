import Vue from "vue"
import Vuex from "vuex"
import moduleGetters from "./getters"
import preview from "./modules/preview"
import config from "@/config"
import { uuid } from "@u/uuid"
import appApi from "@a/apply"
import pageApi from "@a/page"
import widgetApi from "@a/widget"
import { cloneDeep } from "lodash"
import arrayToTree from "array-to-tree"
import { dealPageData, dealWidgetData, dealHomePage,isGroup,findWidgetChildren } from "@u/deal"
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
    showHelpLine: false, // 辅助线
    hint: { show: false, text: "" }, // 提示信息
    saveTime: new Date().getTime(),
    textEditor: { show: false, widget: null }, //显示文本编辑器
    dataConfigList: [] //应用数据源动态配置
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
    setTextEditor(state, data) {
      const tempObj = state.textEditor
      state.textEditor = { ...tempObj, ...data }
    },
    setDataConfigList(state, data) {
      state.dataConfigList = data || []
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
    zIndexOperate(state, data) {
      let page = this.getters.currentPage
      this.getters.selectWidgets.forEach(item => {
        const resIndex = page.widgets.findIndex(w => w.cid == item.cid)
        if (resIndex != -1) {
          const tempWdiget = { ...item }
          switch (data) {
            case "toTop":
              page.widgets.splice(resIndex, 1)
              page.widgets.push(tempWdiget)
              break
            case "toBottom":
              page.widgets.splice(resIndex, 1)
              page.widgets.unshift(tempWdiget)
              break
            case "nextZIndex":
              page.widgts.splice(resIndex + 1, 0, tempWdiget)
              break
            case "lastZIndex":
              page.widgts.splice(resIndex - 1, 0, tempWdiget)
              break
          }
        }
      })
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
      let tempArr = []
      widgets.forEach(item=>{
        if(isGroup(item)) {
          tempArr = tempArr.concat(findWidgetChildren(currentPage.widgets,item.cid))
        } 
        tempArr.push(item)
      })
      tempArr.forEach(item => {
        let currentWidgetIndex = currentPage.widgets.findIndex(
          w => w.cid == item.cid
        )
        state.delWidgets.push(item)
        if (currentWidgetIndex != -1) {
          currentPage.widgets.splice(currentWidgetIndex, 1)
        }
      })
      // 寻找控件的pid数量为1的，（组合里面只剩一个元素时候，要删除组合)
      if(this.getters.selectWidgets.length === 1 && !isGroup(this.getters.currentWidget)) {
        let tempWidgets = cloneDeep(currentPage.widgets)
        tempWidgets = arrayToTree(tempWidgets, { parentProperty: "pid", customID: "cid" })
        tempWdigets.forEach(item=>{
          if(item.length === 1) {
            let resIndex1 = currentPage.widgets.findIndex(w=>w.cid == item.pid)
            let resIndex2 = currentPage.widgets.findIndex(w=>w.cid == item.cid)
            currentPage.widgets.splice(resIndex1, 1)
            currentPage.widgets.splice(resIndex2, 1,{isEdit:true,pid:''})
          }
        })
      }
    },
    setIsShowSelection(state, data) {
      state.isShowSelection = data
    }
  },
  actions: {
    async initApply(store, applyId) {
      store.dispatch("queryApply", applyId)
      const allPageResponse = await pageApi.queryAll({ applyId })
      let allPages = allPageResponse.data
      allPages = dealHomePage(allPages)
      const { pageId } = allPages[0]
      store.commit("initPages", allPages)
      store.commit("setCurrentPageId", pageId)
      return new Promise(resolve => {
        widgetApi.queryAll({ pageId }).then(res => {
          store.commit("setCurrentPageWidgets", dealWidgetData(res.data))
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
            id: data.id,
            dataRate: data.dataRate || 3,
            navPosition: data.navPosition,
            navStyle: data.navStyle
          })
        }
      })
    },
    patchModifyWidgets(store, isNoTip) {
      if (!store.getters.currentPage) {
        return
      }
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
          text: item.text,
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
            store.commit("setSaveTime", new Date().getTime())
            if (!isNoTip) {
              Vue.prototype.$message.success("保存成功")
            }
          }
        })
      } else {
        store.commit("setSaveTime", new Date().getTime())
        if (!isNoTip) {
          Vue.prototype.$message.success("保存成功")
        }
      }
    },
    patchDelWidgets(store, data) {
      widgetApi.delPatch(data.join(",")).then(res => {
        if (res.code === 0) {
          store.commit("setDelWidgets", [])
        }
      })
    },
    updateApply(store, data) {
      const params = { id: store.state.apply.id, ...data }
      store.commit("setApply", data)
      appApi.edit(params).then(res => {
        if (res.code === 0) {
          store.commit("setSaveTime", new Date().getTime())
        }
      })
    },
    updatePageInfo(store, data) {
      const params = { pageId: store.state.currentPageId, ...data }
      store.commit("setPageInfo", data)
      pageApi.modify(params).then(res => {
        if (res.code === 0) {
          store.commit("setSaveTime", new Date().getTime())
        }
      })
    }
  },
  modules: {
    preview
  },
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

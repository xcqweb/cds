<template>
  <div class="preview-con-wrap" v-if="currentPage && apply">
    <div class="preview-con" :style="viewStyleObj">
      <widget-item
        v-for="widget in widgets"
        :key="widget.cid"
        :widget="widget"
        :action-list="actionMap.get(widget.cid)"
      />
    </div>
    <preview-menu v-if="currentPage && apply && position" />
  </div>
  <loading v-else />
</template>
<script>
import Loading from "@c/loading"
import pageApi from "@a/page"
import applyApi from "@a/apply"
import widgetApi from "@a/widget"
import arrayToTree from "array-to-tree"
import { dealWidgetData, dealHomePage,dealDataConfigUrlDev } from "@u/deal"
import WidgetItem from "./widget-item"
import mutualApi from "@a/mutual"
import PreviewMenu from "./preview-menu"
import dataApi from "@a/data"
import instance from "@/api/index"
export default {
  name: "Preview",
  components: {
    WidgetItem,
    PreviewMenu,
    Loading
  },
  computed: {
    currentPage() {
      return this.$store.state.preview.currentPage
    },
    currentPageId() {
      if (this.currentPage) {
        return this.currentPage.pageId
      }
      return ""
    },
    apply() {
      return this.$store.state.preview.apply
    },
    position() {
      return this.apply.navPosition
    }
  },
  watch: {
    currentPageId:{
      handler(val) {
        if(val) {
          this.initPageInfo()
        }
      },
      immediate:true,
    }
  },
  data() {
    return {
      widgets: [],
      viewStyleObj: {},
      actionMap: new Map(),
      lastDataRequestUrl: ""
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      const applyId = this.$route.query.applyId
      this.getDatasourceConfig() 
      this.queryApply(applyId)
      this.queryAllPage(applyId)
    },
    getDatasourceConfig() { // 获取最后一笔数据的请求url
      dataApi.dataUrlList({}).then(res => {
        if (res.code === 0) {
          const configList = res.data || []
          this.lastDataRequestUrl = configList.find(item => item.functionCode == "E007").dsParamValueUrl
          this.lastDataRequestUrl = dealDataConfigUrlDev(this.lastDataRequestUrl)
        }
      })
    },
    queryApply(applyId) { // 查询应用
      applyApi.query(applyId).then(res => {
        if (res.code === 0) {
          this.$store.commit("preview/setApply", res.data || [])
        }
      })
    },
    queryAllPage(applyId) { // 所有页面
      pageApi.queryAll({ applyId }).then(res => {
        if (res.code === 0) {
          let pages = arrayToTree(res.data, {
            parentProperty: "pid",
            customID: "pageId"
          })
          pages = dealHomePage(pages)
          this.$store.commit("preview/setPages", pages)
          this.$store.commit("preview/setCurrentPage", pages[0])
          // this.startTimerPullData()
        }
      })
    },
    startTimerPullData() {// 定时拉取
      this.timer = setTimeout(() => { 
        this.queryPageWidgetsDatas()
      }, (this.apply.dataRate || 3) * 1000)
    },
    initPageAttrs() { // 页面属性
      const { width, height,  backgroundColor, backgroundImage } = this.currentPage
      this.viewStyleObj = {
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: backgroundColor || "#fff",
        backgroundImage: `url(${backgroundImage})`
      }
    },
    queryPageWidgets() { // 页面所有的控件的基本信息
      const pageId = this.currentPage.pageId
      widgetApi.queryAll({ pageId }).then(res => {
        if (res.code === 0) {
          let tempArr = []
          if (res.data.length) {
            tempArr = dealWidgetData(res.data)
          }
          this.widgets = arrayToTree(tempArr, {
            parentProperty: "pid",
            customID: "cid"
          })
        }
      })
    },
    queryPageActions() { // 页面所有控件的交互
      mutualApi.queryPageWidgetsActions({ pageId: this.currentPage.pageId }).then(res => {
        if (res.code === 0) {
          res.data.forEach(item => {
            this.actionMap.set(item.widgetId, item.widgetActionEntityList)
          })
        }
      })
    },
    initPageInfo() {
      this.initPageAttrs() 
      this.queryPageWidgets() 
      this.queryPageActions() 
      this.queryPageWidgetsDatas() 
    },
    queryPageWidgetsDatas() { // 页面所有控件的绑定数据
      const pageId = this.currentPage.pageId
      dataApi.queryPageWidgetsDataBind({ pageId }).then(res => {
        if (res.code === 0 && this.lastDataRequestUrl) {
          let tempData = res.data || []
          let params = []
          let maps = new Map()
          let tempArr = []
          tempData.forEach(item => {
            tempArr = maps.get(item.paramType) || []
            tempArr.push(item)
            maps.set(item.paramType,tempArr)
          })
          let requestArr = []
          for(let key of maps.keys()) {
            let queryList = this.dealWidgetBind(maps.get(key))
            if(queryList.length) {
              let p =this.requestLastData({
                paramType:key,
                tenantMark:this.apply.tenantId,
                queryList,
              })
              requestArr.push(p)
            }
          }
          Promise.all(requestArr).then(res=>{
            console.log(res)
          })
        }
      })
    },
    requestLastData(params) {
      return instance.post(this.lastDataRequestUrl, params)
    },
    dealWidgetBind(dealArr) {// 处理根据paramType分类之后的数据
      let queryList = []
      let tempArr = []
      let modelMaps = new Map()
      let key
      let splitArr
      let deviceParams
      dealArr.forEach(item=>{
        key = `${item.deviceModelMark}-${item.deviceMark}`
        tempArr = modelMaps.get(key) || []
        tempArr.push(item)
        modelMaps.set(key,tempArr)
      })
      for(let key of modelMaps.keys()){
        deviceParams = []
        splitArr = key.split('-')
        let valueList = modelMaps.get(key)
        valueList.forEach(item=>{
          if(item.paramType!=2) {
            deviceParams.push(item.paramMark)
          }
        })
        queryList.push({
          deviceModelMark:splitArr[0],
          deviceParams,
          deviceMark:splitArr[1],
        })
　　　}
      return queryList
    },
  },
  beforeDestroy() {
    if (this.timer) {
      window.clearTimeout(this.timer)
      this.timer = null
    }
  }
}
</script>
<style lang="less">
.preview-con-wrap {
  height: 100%;
  width: 100%;
  overflow: auto;
  background: rgb(245, 245, 245);
  position: relative;
  .preview-con {
    position: relative;
    left: 0;
    top: 0;
    overflow: hidden;
    margin: 0 auto;
  }
  .menu-con {
    position: absolute;
    left: 0;
    top: 0;
    .ant-menu-submenu-title {
      pointer-events: none;
      padding: 0;
      > span {
        display: flex;
        height: 100%;
        pointer-events: auto;
      }
    }
  }
}
</style>

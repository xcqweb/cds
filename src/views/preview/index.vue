<template>
  <div class="preview" v-if="currentPage && apply">
    <div class="preview-con-wrap">
      <div class="preview-con" :style="viewStyleObj" v-if="initAction">
        <widget-item
          v-for="widget in widgets"
          :key="widget.cid"
          :widget="widget"
          :action-list="actionMap.get(widget.cid)"
        />
      </div>
    </div>
    <preview-menu v-if="position" />
    <frame-text v-if="showFrame" />
  </div>
  <loading v-else />
</template>
<script>
import Loading from "@c/loading"
import pageApi from "@a/page"
import applyApi from "@a/apply"
import widgetApi from "@a/widget"
import arrayToTree from "array-to-tree"
import { dealWidgetData, dealHomePage, dealDataConfigUrlDev } from "@u/deal"
import WidgetItem from "./components/widget-item"
import mutualApi from "@a/mutual"
import PreviewMenu from "./components/preview-menu"
import dataApi from "@a/data"
import instance from "@/api/index"
import FrameText from "./components/frame-text"
export default {
  name: "Preview",
  components: {
    WidgetItem,
    PreviewMenu,
    FrameText,
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
    },
    showFrame() {
      return this.$store.state.preview.frameContent.show
    },
    widgets() {
      return arrayToTree(this.originalWidgets, {
        parentProperty: "pid",
        customID: "cid"
      })
    }
  },
  watch: {
    currentPageId: {
      handler(val) {
        if (val) {
          this.initPageInfo()
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      initAction: false,
      viewStyleObj: {},
      originalWidgets: [],
      actionMap: new Map(),
      lastDataRequestUrl: "",
      widgetDatas: [], // 控件绑定的数据
      widgetDatasRequest: [] // 控件绑定的数据所对应推送过来的值
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
    getDatasourceConfig() {
      // 获取最后一笔数据的请求url
      dataApi.dataUrlList({}).then(res => {
        if (res.code === 0) {
          const configList = res.data || []
          this.lastDataRequestUrl = configList.find(
            item => item.functionCode == "E007"
          ).dsParamValueUrl
          this.lastDataRequestUrl = dealDataConfigUrlDev(
            this.lastDataRequestUrl
          )
        }
      })
    },
    queryApply(applyId) {
      // 查询应用
      applyApi.query(applyId).then(res => {
        if (res.code === 0) {
          this.$store.commit("preview/setApply", res.data || [])
        }
      })
    },
    queryAllPage(applyId) {
      // 所有页面
      pageApi.queryAll({ applyId }).then(res => {
        if (res.code === 0) {
          let pages = arrayToTree(res.data, {
            parentProperty: "pid",
            customID: "pageId"
          })
          pages = dealHomePage(pages)
          this.$store.commit("preview/setPages", pages)
          this.$store.commit("preview/setCurrentPage", pages[0])
        }
      })
    },
    startTimerPullData(maps) {
      // 定时拉取
      this.timer = setInterval(() => {
        this.requestLastData(maps)
      }, (this.apply.dataRate || 3) * 1000)
    },
    initPageAttrs() {
      // 页面属性
      const {
        width,
        height,
        backgroundColor,
        backgroundImage
      } = this.currentPage
      this.viewStyleObj = {
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: backgroundColor || "#fff",
      }
      if (backgroundImage) {
        this.viewStyleObj.backgroundImage = `url(${this.$imgUrl(backgroundImage)})`
        this.viewStyleObj.backgroundSize = "100% 100%"
      }
    },
    queryPageWidgets() {
      // 页面所有的控件的基本信息
      const pageId = this.currentPage.pageId
      widgetApi.queryAll({ pageId }).then(res => {
        if (res.code === 0) {
          let tempArr = []
          if (res.data.length) {
            tempArr = dealWidgetData(res.data)
          }
          this.originalWidgets = tempArr
        }
      })
    },
    queryPageActions() {
      // 页面所有控件的交互
      mutualApi
        .queryPageWidgetsActions({ pageId: this.currentPage.pageId })
        .then(res => {
          if (res.code === 0) {
            res.data.forEach(item => {
              this.actionMap.set(item.widgetId, item.widgetActionEntityList)
            })
            this.initAction = true
          }
        })
    },
    initPageInfo() {
      this.initPageAttrs()
      this.queryPageWidgets()
      this.queryPageActions()
      this.queryPageWidgetsDatas()
    },
    queryPageWidgetsDatas() {
      // 页面所有控件的绑定数据
      const pageId = this.currentPage.pageId
      dataApi.queryPageWidgetsDataBind({ pageId }).then(res => {
        if (res.code === 0 && this.lastDataRequestUrl) {
          this.widgetDatas = res.data || []
          let tempData = res.data || []
          let maps = new Map()
          let tempArr = []
          tempData.forEach(item => {
            tempArr = maps.get(item.paramType) || []
            tempArr.push(item)
            maps.set(item.paramType, tempArr)
          })
          if(maps.size) {
            this.requestLastData(maps)
            this.startTimerPullData(maps)
          }
        }
      })
    },
    updateWidgetText(cid, frameText) {
      // 更新控件文本
      const resIndex = this.originalWidgets.findIndex(item => item.cid === cid)
      if (!frameText || resIndex == -1) {
        return
      }
      const resItem = this.originalWidgets[resIndex]
      let frameTexts = resItem.frameTexts
      if (frameTexts) {
        const tempIndex = frameTexts.findIndex(
          item => item.paramMark == frameText.frameText
        )
        if (tempIndex != -1) {
          frameTexts[tempIndex] = frameText
        } else {
          frameTexts.push(frameText)
        }
      } else {
        frameTexts = [frameText]
      }
      let defaultVal = frameTexts[0].paramValue
      let defaultName = frameTexts[0].paramMark
      if (resIndex != -1) {
        this.originalWidgets.splice(resIndex, 1, {
          ...resItem,
          text: `${defaultName}=${defaultVal}`,
          frameTexts
        })
      }
    },
    dealWidgetsText(data) {
      // 处理控件要显示的文本
      let maps = new Map()
      let key
      data.forEach(item => {
        if (item.paramDatas) {
          item.paramDatas.forEach(p => {
            key = `${item.source}-${item.paramType}-${p.paramMark}`
            maps.set(key, p)
          })
        }
      })
      this.widgetDatas.forEach(item => {
        key = `${item.deviceModelMark}-${item.deviceMark}-${item.paramMark}`
        this.updateWidgetText(item.widgetId, maps.get(key))
      })
      this.widgetDatasRequest
    },
    requestLastData(maps) {
      // 最后一笔数据
      let requestArr = []
      for (let key of maps.keys()) {
        let queryList = this.dealWidgetBind(maps.get(key))
        if (queryList.length) {
          let p = instance.post(this.lastDataRequestUrl, {
            paramType: key,
            tenantMark: this.apply.tenantId,
            queryList
          })
          if (p) {
            requestArr.push(p)
          }
        }
      }
      let dataRes = []
      Promise.all(requestArr).then(res => {
        res.forEach(item => {
          if (item.code === 0 && item.data) {
            dataRes.push(item.data.sourceList)
          }
        })
        dataRes = dataRes.flat()
        this.dealWidgetsText(dataRes)
      })
    },
    dealWidgetBind(dealArr) {
      // 处理根据paramType分类之后的数据
      let queryList = []
      let tempArr = []
      let modelMaps = new Map()
      let key
      let splitArr
      let deviceParams
      dealArr.forEach(item => {
        key = `${item.deviceModelMark}-${item.deviceMark}`
        tempArr = modelMaps.get(key) || []
        tempArr.push(item)
        modelMaps.set(key, tempArr)
      })
      for (let key of modelMaps.keys()) {
        deviceParams = []
        splitArr = key.split("-")
        let valueList = modelMaps.get(key)
        valueList.forEach(item => {
          deviceParams.push(item.paramMark)
        })
        if (deviceParams.length) {
          queryList.push({
            deviceModelMark: splitArr[0],
            deviceParams,
            deviceMark: splitArr[1]
          })
        }
      }
      return queryList
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }
}
</script>
<style lang="less">
.preview {
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
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

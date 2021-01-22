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
import { dealWidgetData, dealHomePage } from "@u/deal"
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
    currentPageId() {
      this.queryWidgets()
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
  beforeDestroy() {
    if (this.timer) {
      window.clearTimeout(this.timer)
      this.timer = null
    }
  },
  methods: {
    init() {
      this.getDatasourceConfig() // 获取最后一笔数据的请求url
      const applyId = this.$route.query.applyId
      this.queryApply(applyId)
      this.queryAllPage(applyId)
    },
    queryApply(applyId) {
      applyApi.query(applyId).then(res => {
        if (res.code === 0) {
          this.$store.commit("preview/setApply", res.data || [])
        }
      })
    },
    getDatasourceConfig() {
      dataApi.dataUrlList({}).then(res => {
        if (res.code === 0) {
          const configList = res.data || []
          this.lastDataRequestUrl = configList.find(
            item => item.functionCode == "E007"
          ).dsParamValueUrl
        }
      })
    },
    queryAllPage(applyId) {
      pageApi.queryAll({ applyId }).then(res => {
        if (res.code === 0) {
          let pages = arrayToTree(res.data, {
            parentProperty: "pid",
            customID: "pageId"
          })
          pages = dealHomePage(pages)
          this.$store.commit("preview/setPages", pages)
          this.$store.commit("preview/setCurrentPage", pages[0])
          this.queryAllActions()
          this.initPageAttrs()
          this.queryPageWidgetsDatas() //获取当前页面所有控件的绑定数据
          this.timer = setTimeout(() => {
            // 定时拉取
            this.queryPageWidgetsDatas()
          }, (this.apply.dataRate || 3) * 1000)
        }
      })
    },
    queryWidgets() {
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
    queryPageWidgetsDatas() {
      // 获取当前页面所有控件的数据绑定
      const pageId = this.currentPage.pageId
      // dataApi.queryPageWidgetsDataBind({ pageId }).then(res => {
      //   if (res.code === 0 && this.lastDataRequestUrl) {
      //     let tempData = res.data || []
      //     let params = []
      //     tempData.forEach(item => {
      //       // 收集控件绑定的参数批量请求
      //     })
      //     instance.post(this.lastDataRequestUrl, params).then(result => {
      //       if (result.code === 0) {
      //         this.dealPageWidgetsData(result.data || [])
      //       }
      //     })
      //   }
      // })
    },
    dealPageWidgetsData(data) {
      // 对应的数据映射到对应的控件
    },
    initPageAttrs() {
      const { width, height } = this.currentPage
      this.viewStyleObj = {
        width: `${width}px`,
        height: `${height}px`
      }
    },
    queryAllActions() {
      mutualApi
        .queryPageWidgetsActions({ pageId: this.currentPage.pageId })
        .then(res => {
          if (res.code === 0) {
            res.data.forEach(item => {
              this.actionMap.set(item.widgetId, item.widgetActionEntityList)
            })
          }
        })
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

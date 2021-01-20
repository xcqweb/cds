<template>
  <div class="preview-con-wrap">
    <div class="preview-con" :style="viewStyleObj">
      <preview-item
        v-for="widget in widgets"
        :key="widget.cid"
        :widget="widget"
        :action-list="actionMap.get(widget.cid)"
      />
    </div>
    <preview-menu :pages="pages" :apply="apply" v-if="apply.navPosition" />
  </div>
</template>
<script>
import pageApi from "@a/page"
import applyApi from "@a/apply"
import widgetApi from "@a/widget"
import arrayToTree from "array-to-tree"
import { dealWidgetData } from "@u/deal"
import PreviewItem from "./preview-item"
import mutualApi from "@a/mutual"
import PreviewMenu from "./preview-menu"
export default {
  name: "Preview",
  components: {
    PreviewItem,
    PreviewMenu
  },
  data() {
    return {
      widgets: [],
      pages: [],
      viewStyleObj: {},
      currentPage: null,
      actionMap: new Map(),
      apply: {}
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      const applyId = this.$route.query.applyId
      this.queryApply(applyId)
      this.queryAllPage(applyId)
    },
    queryApply(applyId) {
      applyApi.query(applyId).then(res => {
        if (res.code === 0) {
          this.apply = res.data
        }
      })
    },
    queryAllPage(applyId) {
      pageApi.queryAll({ applyId }).then(res => {
        if (res.code === 0) {
          this.pages = arrayToTree(res.data, {
            parentProperty: "pid",
            customID: "pageId"
          })
          this.currentPage = this.pages[0]
          this.queryAllActions()
          this.initPageAttrs()
          this.queryWidgets(this.currentPage.pageId)
        }
      })
    },
    queryWidgets(pageId) {
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
    },
    titleClick({ domEvent }) {
      domEvent.stopPropagation()
      console.log("titleClick")
      return false
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

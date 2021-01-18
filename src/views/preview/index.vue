<template>
  <div class="preview-con-wrap">
    <div class="preview-con" :style="styleObj">
      <preview-item
        v-for="widget in widgets"
        :key="widget.cid"
        :widget="widget"
      />
    </div>
  </div>
</template>
<script>
import pageApi from "@a/page"
import widgetApi from "@a/widget"
import arrayToTree from "array-to-tree"
import { dealWidgetData } from "@u/deal"
import PreviewItem from "./preview-item"
import mutualApi from '@a/mutual'
export default {
  name: "Preview",
  components: {
    PreviewItem
  },
  data() {
    return {
      widgets: [],
      pages: [],
      styleObj: {},
      currentPage: null
    }
  },
  created() {
    this.queryAllPage(this.$route.query.applyId)
  },
  methods: {
    queryAllPage(applyId) {
      pageApi.queryAll({ applyId }).then(res => {
        if (res.code === 0) {
          this.pages = res.data
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
      this.styleObj = {
        width: `${width}px`,
        height: `${height}px`
      }
    },
    queryAllActions() {
      mutualApi.queryPageWidgetsActions(this.currentPage.pageId).then(res=>{
        
      })
    }
  }
}
</script>
<style lang="less">
.preview-con-wrap {
  height: 100%;
  width: 100%;
  overflow: hidden;
}
.preview-con {
  position: relative;
  left: 0;
  top: 0;
}
</style>

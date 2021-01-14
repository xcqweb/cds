<template>
  <div class="preview-con-wrap">
    <div class="preview-con" :style="styleObj">
      <template v-for="item in widgets">
        <component :key="item.cid" :is="item.cname" v-bind="item.attrs">
          <template v-if="item.children">
            <component
              v-for="d in item.children"
              :key="d.cid"
              :is="d.cname"
              v-bind="d.attrs"
            />
          </template>
        </component>
      </template>
    </div>
  </div>
</template>
<script>
import components from "@/views/widgets/index"
import pageApi from "@a/page"
import widgetApi from "@a/widget"
import arrayToTree from "array-to-tree"
import { dealWidgetData } from "@u/deal"
export default {
  name: "Preview",
  components: {
    ...components
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
    this.queryAllPage("d82692156aab552c3ac1ce0fe51ae38c")
  },
  methods: {
    queryAllPage(applyId) {
      pageApi.queryAll({ applyId }).then(res => {
        if (res.code === 0) {
          this.pages = res.data
          this.currentPage = this.pages[0]
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

<template>
  <div class="preview-con-wrap">
    <div class="preview-con" :style="styleObj">
      <template v-for="item in widgets">
          <component
            v-if="!item.children || !item.children.length"
            :key="item.widgetId"
            :is="item.cname"
            v-bind="item.attrs"
          />
          <component
            v-else
            :key="item.widgetId"
            :is="item.cname"
            v-bind="item.attrs"
          >
          <component
            v-for="d in item.children"
            :key="d.widgetId"
            :is="d.cname"
            v-bind="d.attrs"
          />
          </component>
      </template>
    </div>
  </div>
</template>
<script>
import components from "@/views/widgets/index"
import appApi from "@a/apply"
import pageApi from "@a/page"
import widgetApi from '@a/widget'
import arrayToTree from 'array-to-tree'
export default {
  name:'Preview',
  components: {
    ...components
  },
  data() {
    return {
      widgets:[],
      pages:[],
      styleObj:{},
      currentPage:null,
    }
  },
  created() {
    this.queryAllPage('d82692156aab552c3ac1ce0fe51ae38c')
  },
  methods: {
    queryAllPage(applyId) {
      pageApi.queryAll({applyId}).then(res=>{
        if(res.code === 0) {
          this.pages = res.data
          this.currentPage = this.pages[0]
          this.initPageAttrs()
          this.queryWidgets(this.currentPage.pageId)
        }
      })
    },
    queryWidgets(pageId) {
      widgetApi.queryAll({pageId}).then(res=>{
        if(res.code === 0) {
          const tempArr = res.data.map(item=>{
            return {
              widgetId:item.widgetId,
              name:item.widgetName,
              cname:item.cname,
              pid:item.pid,
              attrs:{
                width:item.width,
                height:item.height,
                left:item.left,
                top:item.top,
                rotate:item.rotate,
                zIndex:item.zIndex,
              },
            }
          })
          this.widgets = arrayToTree(tempArr,{parentProperty:'pid',customID:'widgetId'})
        }
      })
    },
    initPageAttrs() {
      const {width,height} = this.currentPage
      this.styleObj = {
        width:`${width}px`,
        height:`${height}px`,
      }
    }
  },
}
</script>
<style lang="less">
.preview-con-wrap{
  height: 100%;
  width:100%;
  overflow: hidden;
}
.preview-con{
  position:relative;
  left:0;
  top:0;
}
</style>
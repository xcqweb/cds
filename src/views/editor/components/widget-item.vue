<template>
  <div 
    class="group-item" 
    :style="objStyle"
    @mouseup="mouseup"
  >
  <template v-if="widget.children">
    <widget-item
      v-for="item in widget.children"
      :pwidget="widget"
      :key="item.cid"
      :widget="item"
    />
  </template>
   <component
      v-else
      :is="widget.cname"
      v-bind="widget.attrs"
      :text="widget.text"
      :cid="widget.cid"
    />
  </div>
</template>
<script>
import components from "@/views/widgets/index"
import { findWidgetChildren,isGroup,findWidgetById,clickWhichWidget } from "@u/deal"
import helpMethods from "@/mixins/help-methods"
import helpComputed from "@/mixins/help-computed"
import config from "@/config"
export default {
  name: "WidgetItem",
  mixins: [helpMethods,helpComputed],
  components: {
    ...components
  },
  props: {
    widget: Object,
    pwidget:Object,// 父控件
  },
  computed: {
    objStyle() {
      let { width, height, left, top, rotate } = this.widget.attrs
      if(this.pwidget) {
        const {left:pleft,top:ptop} = this.pwidget.attrs
        left = left - pleft
        top = top - ptop
      }
      return {
        width: `${width}px`,
        height: `${height}px`,
        left: `${left}px`,
        top: `${top}px`,
        transform: `rotate(${rotate}deg)`
      }
    }
  },
  data() {
    return {}
  },
  created() {
    document.querySelector('body').addEventListener('mouseup',this.mouseupBody)
  },
  beforeDestroy() {
    document.querySelector('body').removeEventListener('mouseup',this.mouseupBody)
  },
  methods: {
    mousedown(evt) {
      const {x,y,target} = evt
      this.widgetArr = []
      let resChildren
      let tempArr = [...this.selectWidgets]
      tempArr.forEach(item=>{
        if(isGroup(item)) {
          resChildren = findWidgetChildren(this.currentPage.widgets,item.cid)
          if(resChildren) {
            this.widgetArr = this.widgetArr.concat(resChildren)
          }
        }
        if(item.cid!=this.widget.cid) {
          this.widgetArr.push(item)
        }
      })
      this.widgetArr.push(this.widget)
      this.widgetStartX = x
      this.widgetStartY = y
      this.widgetMoveStart = true
    },
    mousemove(evt) {
      if(this.widgetMoveStart) {
        this.moving = true
        const {x,y,target} = evt
        let disX = x - this.widgetStartX
        let disY = y - this.widgetStartY
        this.widgetArr.forEach(item=>{
          this.$store.commit("updateWidgetAttrs", {
            left:item.attrs.left + disX,
            top:item.attrs.top + disY,
            cid:item.cid
          })
        })
      }

    },
    mouseup() {
      // clearTimeout(this.timer) // 同一元素 同时绑定单击和双击事件
      // this.timer = setTimeout(() => {
      //   let {cid,pid} = this.widget
      //   let resWidget = this.widget
      //   console.log(this.widget,"dd------------")
      //   if(pid) {
      //     cid = pid
      //     resWidget = findWidgetById(this.currentPage.widgets,cid)
      //   }  
      //   this.$store.commit("updateWidget", { active: true, cid})
      //   const {left,top,width,height} = resWidget.attrs
      //   this.$store.commit("setRuler", {
      //     shadow: { x: left, y: top, width, height }
      //   })
      // },100)
      let {cid,pid} = this.widget
      if(pid) {
        cid = pid
        // 重新计算父组合的信息
        let widgets = findWidgetChildren(this.currentPage.widgets,cid)
        const attrs = this.calculateSelectWidgets(widgets)
        const {left,top,width,height} = attrs
        this.$store.commit("updateWidgetAttrs",{cid,left,top,width,height})
      }  
      this.$store.commit("updateWidget", { active: true, cid})
    },
    mouseupBody() {
      this.widgetMoveStart = false
      this.moving = false
    },
    dblclick(evt) {
      clearTimeout(this.timer)
      let { x, y } = evt
      const ele = document.querySelector(".viewport")
      const { left, top } = ele.getBoundingClientRect()
      x = x - left
      y = y - top
      const editableWidetList = config.editableWidetList
      let {cname} = this.widget
      const resWidget = clickWhichWidget(this.currentPage.widgets,this.widget,{x,y})
      if(resWidget) {
        cname = resWidget.cname
         this.$store.commit("updateWidget", {
          active: false,
          cid: this.widget.cid
        })
        this.$store.commit("updateWidget", { active: true,  cid: resWidget.cid })
      } else {
        if(editableWidetList.includes(cname)) {
          this.$store.commit("updateWidget", {
            active: false,
            cid: this.widget.cid
          })
          this.$store.commit("setTextEditor", { show: true, widget:this.widget})
        }
      }
    },
  }
}
</script>
<style lang="less">
.group-item{
  position:absolute;
  cursor:move;
}
</style>

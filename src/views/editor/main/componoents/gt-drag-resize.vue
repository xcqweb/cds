<template>
   <vue-draggable-resizable
      class="group-item"
      v-for="d in widgets"
      :w="d.attrs.width"
      :h="d.attrs.height"
      :x="d.attrs.left"
      :y="d.attrs.top"
      :r="d.attrs.rotate"
      :parent="true"
      :active.sync="d.active"
      :key="d.cid"
      @rotating="onRotate"
      @dragStart="onDragStart"
      @dragging="onDrag"
      @resizing="onResize"
      @resizestop="onResizeStop"
      @dragstop="onDragStop"
      @rotatestop="onRotateStop"
      @activated="onActivated(d)"
      @deactivated="onDeactivated(d)"
    >
      <component :is="d.cname" v-bind="d.attrs" v-else />
      <component :is="d.cname" v-bind="d.attrs" v-if="item.children"> 
        <gt-drag-resize :widgets="item.children"/>
      </component>
    </vue-draggable-resizable>
</template>
<script>
import VueDraggableResizable from "@c/drag-resize/vue-draggable-resizable"
import template from '../../../../../../igc-frontend/src/views/platform/news/template/template.vue'
export default {
  components: { template },
  name:'GtDragResize',
  props:{
    widgets:Array,
  },
  methods: {
    onRotate(rotate) {
      const operateWidget = this.selectWidgets[0]
      this.$store.commit("updateWidgetAttrs", { rotate,cid:operateWidget.cid})
      this.showHint = true
      this.hintText = `${rotate}`
    },
    onDragStart(left,top) {
      this.startDragLeft = left
      this.startDargTop = top
      this.selectWidgetsCopy = cloneDeep(this.selectWidgets)
    },
    onDrag(left, top) {
      if(this.selectWidgetsCount === 1) {
        const operateWidget = this.selectWidgets[0]
        this.$store.commit("updateWidgetAttrs", { left, top, cid:operateWidget.cid })
        this.showHint = true
        this.hintText = `${left},${top}`
        const { rotate, width, height } = operateWidget.attrs
        if (rotate % 180 == 0) {
          this.showHelpLine = true
        }
        this.$store.commit("setRuler", {
          shadow: { x: left, y: top, width, height }
        })
      } else{
        const disLeft = left - this.startDragLeft
        const disTop = top - this.startDargTop
        this.selectWidgetsCopy.forEach(item=>{
          this.$store.commit("updateWidgetAttrs", { left:item.attrs.left + disLeft, top:item.attrs.top + disTop, cid:item.cid })
        })
      }
    },
    onResizeStart(left,top,width,height) {
      this.initWidgetWidth = width
      this.initWidgetHeight = height
    },
    onResize(left, top, width, height) {
      console.log('onresize--')
      const operateWidget = this.selectWidgets[0]
      this.$store.commit("updateWidgetAttrs", { left, top, width, height,cid:operateWidget.cid})
      this.showHint = true
      this.hintText = `${width}x${height}`
      this.$store.commit("setRuler", {
        shadow: { x: left, y: top, width, height }
      })
    },
    onResizeStop() {
      undoManager.saveApplyChange()
      this.showHint = false
    },
    onRotateStop() {
      undoManager.saveApplyChange()
      this.showHint = false
    },
    onDragStop() {
      undoManager.saveApplyChange()
      this.showHint = false
      this.showHelpLine = false
    },
    onActivated(item) {
      this.$store.commit("setCurrentWidgetId", item.cid)
      this.$store.commit('updateWidget',{active:true,cid:item.cid})
      undoManager.saveApplyChange()
    },
    onDeactivated(item) {
      console.log('deac')
      this.$store.commit("setCurrentWidgetId",'')
      this.$store.commit('updateWidget',{active:false,cid:item.cid})
    },
  },
}
</script>
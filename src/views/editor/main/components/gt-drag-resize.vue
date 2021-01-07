<template>
<div class="goup-list" @dragover.prevent @drop="drop">
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
      <component :is="d.cname" v-bind="d.attrs" v-if="d.children"> 
        <gt-drag-resize :widgets="d.children"/>
      </component>
      <component :is="d.cname" v-bind="d.attrs" v-else />
    </vue-draggable-resizable>
</div>
</template>
<script>
import VueDraggableResizable from "@c/drag-resize/vue-draggable-resizable"
import {cloneDeep} from "lodash"
import components from "@/widgets/index"
import undoManager from "@u/undo-manager"
import helpComputed from "@/mixins/help-computed"
export default {
  name:'GtDragResize',
  mixins: [helpComputed],
  components: {
    VueDraggableResizable,
    ...components
  },
  props:{
    widgets:Array,
  },
  computed:{
    selectWidgetsCount() {
      return this.selectWidgets.length
    }
  },
  methods: {
    drop(evt) {
      const { dataTransfer, x, y } = evt // 拖拽结束，鼠标与文档的距离
      const item = JSON.parse(dataTransfer.getData("item"))
      const { dx, dy } = item
      const ele = document.querySelector('.viewport')
      let { left, top } = ele.getBoundingClientRect() // 画布与文档的距离
      item.left = x - left - dx
      item.top = y - top - dy
      this.$store.commit("widgetAdd", { ...item })
      undoManager.saveApplyChange()
    },
    onRotate(rotate) {
      const operateWidget = this.selectWidgets[0]
      this.$store.commit("updateWidgetAttrs", { rotate,cid:operateWidget.cid})
      this.updateHint(true,rotate)
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
        this.updateHint(true,`${left},${top}`)
        const { rotate, width, height } = operateWidget.attrs
        if (rotate % 180 == 0) {
          this.$emit('updateHelpLine',true)
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
      const operateWidget = this.selectWidgets[0]
      this.$store.commit("updateWidgetAttrs", { left, top, width, height,cid:operateWidget.cid})
      this.updateHint(true,`${width}x${height}`)
      this.$store.commit("setRuler", {
        shadow: { x: left, y: top, width, height }
      })
    },
    onResizeStop() {
      undoManager.saveApplyChange()
      this.updateHint(false,'')
    },
    onRotateStop() {
      undoManager.saveApplyChange()
      this.updateHint(false,'')
    },
    onDragStop() {
      undoManager.saveApplyChange()
      this.updateHint(false,'')
      this.updateHelpLine(false)
    },
    onActivated(item) {
      this.$store.commit("setCurrentWidgetId", item.cid)
      this.$store.commit('updateWidget',{active:true,cid:item.cid})
      undoManager.saveApplyChange()
    },
    onDeactivated(item) {
      this.$store.commit("setCurrentWidgetId",'')
      this.$store.commit('updateWidget',{active:false,cid:item.cid})
    },
    updateHint(showHint,hintText) {
      this.$emit('updateHint',showHint,hintText)
    },
    updateHelpLine(show) {
      this.$emit('updateHelpLine',show)
    }
  },
}
</script>
<style lang="less">
.goup-list {
  position: relative;
  z-index: 1;
  height: 100%;
  .group-item {
    &:hover::before {
      content: "";
      position: absolute;
      top: -1px;
      right: -1px;
      bottom: -1px;
      left: -1px;
      border: 2px solid rgb(30, 152, 234);
      z-index: 999999999;
    }
    &.active:before {
      border: 1px dashed #298df8;
    }
    .handle {
      width: 18px;
      height: 18px;
      border: none;
      background: url("~@/assets/images/icon/resize-dot.svg") 100% 100%;
      &.handle-tl {
        top: -9px;
        left: -9px;
      }
      &.handle-tm {
        top: -9px;
        left: 50%;
        margin-left: -9px;
      }
      &.handle-tr {
        top: -9px;
        right: -9px;
      }
      &.handle-mr {
        right: -9px;
        margin-top: -9px;
      }
      &.handle-br {
        bottom: -9px;
        right: -9px;
      }
      &.handle-bm {
        bottom: -9px;
        margin-left: -9px;
      }
      &.handle-bl {
        bottom: -9px;
        left: -9px;
      }
      &.handle-ml {
        left: -9px;
        margin-top: -9px;
      }
      &.handle-rot {
        background: url("~@/assets/images/icon/rotate-dot.svg") 100%
          100% no-repeat;
        margin-top: -28px;
        &:before {
          width: 0;
          height: 0;
          border: 0;
        }
      }
    }
  }
}
</style>
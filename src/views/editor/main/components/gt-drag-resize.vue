<template>
  <div @dragover.prevent @drop="drop">
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
      @dragstart="onDragStart"
      @dragging="onDrag"
      @resizestart="(left,top,width,height)=>onResizeStart(left,top,width,height,d)"
      @resizing="onResize"
      @dragstop="onDragStop"
      @resizestop="onResizeStop"
      @rotatestop="onRotateStop"
      @activated="onActivated(d)"
      @deactivated="onDeactivated(d)"
      @dblclick.native.capture="dblclick(d,$event)"
    >
      <component :is="d.cname" v-bind="d.attrs" v-if="d.children">
        <gt-drag-resize :widgets="d.children" />
      </component>
      <component :is="d.cname" v-bind="d.attrs" v-else />
    </vue-draggable-resizable>
  </div>
</template>
<script>
import VueDraggableResizable from "@c/drag-resize/vue-draggable-resizable"
import { cloneDeep } from "lodash"
import components from "@/views/widgets/index"
import undoManager from "@u/undo-manager"
import helpComputed from "@/mixins/help-computed"
import { isGroup, findWidgetChildren} from "@u/deal"
export default {
  name: "GtDragResize",
  mixins: [helpComputed],
  components: {
    VueDraggableResizable,
    ...components
  },
  props: {
    widgets: Array
  },
  computed: {
    selectWidgetsCount() {
      return this.selectWidgets.length
    }
  },
  methods: {
    drop(evt) {
      const { dataTransfer, x, y } = evt // 拖拽结束，鼠标与文档的距离
      const item = JSON.parse(dataTransfer.getData("item"))
      const { dx, dy } = item
      const ele = document.querySelector(".viewport")
      let { left, top } = ele.getBoundingClientRect() // 画布与文档的距离
      item.left = x - left - dx
      item.top = y - top - dy
      this.$store.commit("widgetAdd", { ...item })
      undoManager.saveApplyChange()
    },
    onRotate(rotate) {
      const opWidget = this.selectWidgets[0]
      this.$store.commit("updateWidgetAttrs", {
        rotate,
        cid: opWidget.cid
      })
      this.updateHint(true, `${rotate}`)
    },
    onDragStart(left, top) {
      this.startDragLeft = left
      this.startDargTop = top
      this.selectWidgetsCopy = cloneDeep(this.selectWidgets)
    },
    onDrag(left, top) {
      if (this.selectWidgetsCount === 1) {
        const opWidget = this.selectWidgets[0]
        this.$store.commit("updateWidgetAttrs", {
          left,
          top,
          cid: opWidget.cid
        })
        this.updateHint(true, `${left},${top}`)
        const { rotate, width, height } = opWidget.attrs
        if (rotate % 180 == 0) {
          this.$emit("updateHelpLine", true)
        }
        this.$store.commit("setRuler", {
          shadow: { x: left, y: top, width, height }
        })
      } else {
        const disLeft = left - this.startDragLeft
        const disTop = top - this.startDargTop
        this.selectWidgetsCopy.forEach(item => {
          this.$store.commit("updateWidgetAttrs", {
            left: item.attrs.left + disLeft,
            top: item.attrs.top + disTop,
            cid: item.cid
          })
        })
      }
    },
    onResizeStart(left, top, width, height,item) {
      this.startResizeWidth = width
      this.startResizeHeight = height
      if(item.children && item.children.length) {
        this.groupWidgetChildrenCopy = cloneDeep(item.children)
      } else {
        this.groupWidgetChildrenCopy = []
      }
    },
    onResize(left, top, width, height) {
      const opWidget = this.selectWidgets[0]
      this.$store.commit("updateWidgetAttrs", {
        left,
        top,
        width,
        height,
        cid: opWidget.cid
      })
      if(!isGroup(opWidget)) {// 非组合
        this.updateHint(true, `${width}x${height}`)
        this.$store.commit("setRuler", {
          shadow: { x: left, y: top, width, height }
        })
      } else {
        this.groupWidgetChildrenCopy.forEach(item => {
          let rateW = item.attrs.width/this.startResizeWidth
          let rateH = item.attrs.height/this.startResizeHeight
          const disW = width - this.startResizeWidth
          const disH = height - this.startResizeHeight
          let obj = {
            width: width*rateW,
            height: height*rateH,
          }
          if(item.attrs.left!=0) {
            obj.left = disW - obj.width + item.attrs.left + item.attrs.width
          }
          if(item.attrs.top!=0) {
            obj.top = disH - obj.height + item.attrs.top + item.attrs.height
          }
          this.$store.commit("updateWidgetAttrs", {
            ...obj,
            cid: item.cid
          })
        })
      }
    },
    onResizeStop() {
      undoManager.saveApplyChange()
      this.updateHint(false, "")
    },
    onRotateStop() {
      undoManager.saveApplyChange()
      this.updateHint(false, "")
    },
    onDragStop() {
      undoManager.saveApplyChange()
      this.updateHint(false, "")
      this.updateHelpLine(false)
    },
    onActivated(item) {
      this.$store.commit("setCurrentWidgetId", item.cid)
      this.$store.commit("updateWidget", { active: true, cid: item.cid })
      undoManager.saveApplyChange()
    },
    onDeactivated(item) {
      this.$store.commit("setCurrentWidgetId", "")
      this.$store.commit("updateWidget", { active: false, cid: item.cid })
    },
    updateHint(showHint, hintText) {
      this.$emit("updateHint", showHint, hintText)
    },
    updateHelpLine(show) {
      this.$emit("updateHelpLine", show)
    },
    dblclick(d,evt) {
      console.log(d,evt)
    },
  }
}
</script>
<style lang="less">
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
      background: url("~@/assets/images/icon/rotate-dot.svg") 100% 100%
        no-repeat;
      margin-top: -28px;
      &:before {
        width: 0;
        height: 0;
        border: 0;
      }
    }
  }
}
</style>

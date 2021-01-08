<template>
  <vue-draggable-resizable
    class="group-item"
    :w="widget.attrs.width"
    :h="widget.attrs.height"
    :x="widget.attrs.left"
    :y="widget.attrs.top"
    :r="widget.attrs.rotate"
    :z="widget.attrs.zIndex"
    :parent="true"
    :active.sync="widget.active"
    :key="widget.cid"
    @rotating="onRotate"
    @dragstart="onDragStart"
    @dragging="onDrag"
    @resizestart="
      (left, top, width, height) =>
        onResizeStart(left, top, width, height, widget)
    "
    @resizing="onResize"
    @dragstop="onDragStop"
    @resizestop="onResizeStop"
    @rotatestop="onRotateStop"
    @activated="onActivated(widget)"
    @deactivated="onDeactivated(widget)"
    @dblclick.native="dblclick(widget, $event)"
  >
    <component
      v-if="!widget.children || !widget.children.length"
      :is="widget.cname"
      v-bind="widget.attrs"
    />
    <component v-else :is="widget.cname" v-bind="widget.attrs">
      <drag-widget
        v-for="item in widget.children"
        :key="item.cid"
        :widget="item"
      />
    </component>
  </vue-draggable-resizable>
</template>
<script>
import VueDraggableResizable from "@c/drag-resize/vue-draggable-resizable"
import { cloneDeep } from "lodash"
import components from "@/views/widgets/index"
import undoManager from "@u/undo-manager"
import helpComputed from "@/mixins/help-computed"
import { isGroup, pointIsInWidget } from "@u/deal"
export default {
  name: "DragWidget",
  props: {
    widget: Object
  },
  mixins: [helpComputed],
  components: {
    VueDraggableResizable,
    ...components
  },
  computed: {
    selectWidgetsCount() {
      return this.selectWidgets.length
    }
  },
  methods: {
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
    onResizeStart(left, top, width, height, item) {
      this.startResizeWidth = width
      this.startResizeHeight = height
      if (item.children && item.children.length) {
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
      if (!isGroup(opWidget)) {
        // 非组合
        this.updateHint(true, `${width}x${height}`)
        this.$store.commit("setRuler", {
          shadow: { x: left, y: top, width, height }
        })
      } else {
        this.groupWidgetChildrenCopy.forEach(item => {
          let rateW = item.attrs.width / this.startResizeWidth
          let rateH = item.attrs.height / this.startResizeHeight
          const disW = width - this.startResizeWidth
          const disH = height - this.startResizeHeight
          let obj = {
            width: width * rateW,
            height: height * rateH
          }
          if (item.attrs.left != 0) {
            obj.left = disW - obj.width + item.attrs.left + item.attrs.width
          }
          if (item.attrs.top != 0) {
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
    dblclick(item, evt) {
      console.log(evt, "a----")
      if (isGroup(item)) {
        let { x, y } = evt
        const ele = document.querySelector(".viewport")
        const { left, top } = ele.getBoundingClientRect()
        x = x - left
        y = y - top
        let targetWidget
        for (let i = 0; i < item.children.length; i++) {
          if (pointIsInWidget({ x, y }, item.children[i], item)) {
            targetWidget = item.children[i]
            this.$store.commit("updateWidget", {
              active: true,
              cid: targetWidget.cid
            })
            this.$store.commit("setCurrentWidgetId", targetWidget.cid)
            break
          }
        }
        this.$store.commit("updateWidget", { active: false, cid: item.cid })
      } else {
        console.log("t--a--")
      }
    }
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

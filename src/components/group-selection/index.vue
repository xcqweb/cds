<template>
  <vue-draggable-resizable
    v-if="groupSelection.show"
    class="group-item"
    :w="widget.attrs.width"
    :h="widget.attrs.height"
    :x="widget.attrs.left"
    :y="widget.attrs.top"
    :r="widget.attrs.rotate"
    :z="widget.attrs.zIndex"
    :active.sync="widget.active"
    @rotating="onRotate"
    @dragging="onDrag"
    @resizestart="onResizeStart"
    @resizing="onResize"
    @dragstop="onDragStop"
    @resizestop="onResizeStop"
    @rotatestop="onRotateStop"
    @activated="onActivated"
    @deactivated="onDeactivated"
    @dblclick.native="dblclick"
  />
</template>
<script>
import VueDraggableResizable from "@c/drag-resize/vue-draggable-resizable"
// import { cloneDeep } from "lodash"
import { findWidgetChildren, pointIsInWidget } from "@u/deal"
import helpDrag from "@/mixins/help-drag"
export default {
  name: "GroupSelection",
  components: {
    VueDraggableResizable
  },
  mixins: [helpDrag],
  computed: {
    groupSelection() {
      return this.$store.state.groupSelection
    },
    widget() {
      return this.groupSelection.widget
    },
    widgetChildren() {
      if (this.widget) {
        return findWidgetChildren(
          this.$store.getters.currentPage.widgets,
          this.widget
        )
      }
      return []
    }
  },
  methods: {
    onDrag(left, top) {
      this.$store.commit("updateWidgetAttrs", {
        left,
        top,
        cid: this.widget.cid
      })
      this.updateHint(true, `${left},${top}`)
      const { rotate, width, height } = this.widget.attrs
      if (rotate % 180 == 0) {
        this.$store.commit("setShowHelpLine", true)
      }
      this.$store.commit("setRuler", {
        shadow: { x: left, y: top, width, height }
      })
    },
    onResizeStart(left, top, width, height) {
      this.startResizeWidth = width
      this.startResizeHeight = height
    },
    onResize(left, top, width, height) {
      this.$store.commit("updateWidgetAttrs", {
        left,
        top,
        width,
        height,
        cid: this.widget.cid
      })
      this.updateHint(true, `${width}x${height}`)
      this.$store.commit("setRuler", {
        shadow: { x: left, y: top, width, height }
      })
    },
    dblclick(evt) {
      let { x, y } = evt
      const ele = document.querySelector(".viewport")
      const { left, top } = ele.getBoundingClientRect()
      x = x - left
      y = y - top
      let targetWidget
      for (let i = 0; i < this.widgetChildren.length; i++) {
        if (pointIsInWidget({ x, y }, this.widgetChildren[i], this.widget)) {
          targetWidget = this.widgetChildren[i]
          this.$store.commit("updateWidget", {
            active: true,
            cid: targetWidget.cid
          })
          break
        }
      }
      if (targetWidget) {
        this.$store.commit("setGroupSelection", {
          show: false,
          widget: this.widget
        })
        this.$store.commit("updateWidget", {
          active: false,
          cid: this.widget.cid
        })
      }
    }
  }
}
</script>

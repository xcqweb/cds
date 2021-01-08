<template>
  <vue-draggable-resizable
    v-if="!widget.children || !widget.children.length"
    class="group-item"
    :w="widget.attrs.width"
    :h="widget.attrs.height"
    :x="widget.attrs.left"
    :y="widget.attrs.top"
    :r="widget.attrs.rotate"
    :z="widget.attrs.zIndex"
    :parent="true"
    :active.sync="widget.active"
    @rotating="onRotate"
    @dragstart="onDragStart"
    @dragging="onDrag"
    @resizestart="onResizeStart"
    @resizing="onResize"
    @dragstop="onDragStop"
    @resizestop="onResizeStop"
    @rotatestop="onRotateStop"
    @activated="onActivated"
    @deactivated="onDeactivated"
    @dblclick.native="dblclick"
  >
    <component :is="widget.cname" :cid="widget.cid" v-bind="widget.attrs" />
  </vue-draggable-resizable>
  <component v-else :is="widget.cname" v-bind="widget.attrs" :cid="widget.cid">
    <drag-widget
      v-for="item in widget.children"
      :key="item.cid"
      :widget="item"
    />
  </component>
</template>
<script>
import VueDraggableResizable from "@c/drag-resize/vue-draggable-resizable"
import { cloneDeep } from "lodash"
import components from "@/views/widgets/index"
import helpComputed from "@/mixins/help-computed"
import helpDrag from "@/mixins/help-drag"
export default {
  name: "DragWidget",
  props: {
    widget: Object
  },
  mixins: [helpComputed, helpDrag],
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
    onDragStart(left, top) {
      this.startDragLeft = left
      this.startDargTop = top
      this.selectWidgetsCopy = cloneDeep(this.selectWidgets)
    },
    onDrag(left, top) {
      if (this.selectWidgetsCount === 1) {
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
      console.log(evt)
    }
  }
}
</script>
<style lang="less"></style>

<template>
  <vue-draggable-resizable
    class="group-item"
    :w="widget.attrs.width"
    :h="widget.attrs.height"
    :x="widget.attrs.left"
    :y="widget.attrs.top"
    :r="widget.attrs.rotate"
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
    :handles="handles"
    :cursors="cursors"
  >
    <component
      :is="widget.cname"
      v-bind="widget.attrs"
      :text="widget.text"
      :cid="widget.cid"
      ref="widgetRef"
    >
      <template v-if="widget.children">
        <drag-widget
          v-for="item in widget.children"
          :key="item.cid"
          :widget="item"
        />
      </template>
    </component>
  </vue-draggable-resizable>
</template>
<script>
import VueDraggableResizable from "./vue-draggable-resizable"
import { cloneDeep } from "lodash"
import components from "@/views/widgets/index"
import helpComputed from "@/mixins/help-computed"
import helpDrag from "@/mixins/help-drag"
import { isGroup } from "@u/deal"
const handles = ["tl", "tm", "tr", "mr", "br", "bm", "bl", "ml", "rot"]
const cursors = [
  "nwse-resize",
  "ns-resize",
  "nesw-resize",
  "ew-resize",
  "nwse-resize",
  "ns-resize",
  "nesw-resize",
  "ew-resize"
]
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
  watch: {
    cname:{
      handler(val) {
        if (val === "GtLine") {
          this.handles = ["mr", "ml"]
          this.cursors = ["ew-resize", "ew-resize"]
        } else {
          this.handles = handles
        }
      },
      immediate:true,
    }
  },
  data() {
    return {
      handles,
      cursors
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
      this.groupWidgetChildrenCopy = cloneDeep(this.widget.children)
    },
    onResize(left, top, width, height) {
      this.$store.commit("updateWidgetAttrs", {
        left,
        top,
        width,
        height,
        cid: this.widget.cid
      })
      if (isGroup(this.widget)) {
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
      this.updateHint(true, `${width}x${height}`)
      this.$store.commit("setRuler", {
        shadow: { x: left, y: top, width, height }
      })
    },
    dblclick() {
      const widgetComponent = this.$refs.widgetRef
      console.log(widgetComponent, "a-----")
      if (widgetComponent.dblclick) {
        widgetComponent.dblclick()
      }
    }
  }
}
</script>
<style lang="less"></style>

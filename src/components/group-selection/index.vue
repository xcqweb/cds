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
    :parent="true"
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
  />
</template>
<script>
import VueDraggableResizable from "@c/drag-resize/vue-draggable-resizable"
import undoManager from "@u/undo-manager"
import { cloneDeep } from "lodash"
import { isGroup, findWidgetChildren, } from "@u/deal"
export default {
  name:'GroupSelection',
    components:{
    VueDraggableResizable,
  },
  computed:{
    groupSelection() {
      return this.$store.state.groupSelection
    },
    widget() {
      return this.groupSelection.widget
    },
  },
  methods: {
    onRotate(rotate) {
      this.$store.commit("updateWidgetAttrs", {
        rotate,
        cid: this.widget.cid
      })
      this.updateHint(true, `${rotate}`)
    },
    onDrag(left, top) {
      this.$store.commit("updateWidgetAttrs", {
        left,
        top,
        cid: this.widget.cid
      })
      this.updateHint(true, `${left},${top}`)
      const { rotate, width, height } = this.widget.attrs
      if (rotate % 180 == 0) {
        this.$store.commit('setShowHelpLine',true)
      }
      this.$store.commit("setRuler", {
        shadow: { x: left, y: top, width, height }
      })
    },
    onResizeStart(left, top, width, height) {
      this.startResizeWidth = width
      this.startResizeHeight = height
      const childWidgets = findWidgetChildren(this.$store.getters.currentPage.widgets,this.widget)
      if (childWidgets && childWidgets.length) {
        this.groupWidgetChildrenCopy = cloneDeep(childWidgets)
      } else {
        this.groupWidgetChildrenCopy = []
      }
    },
    onResize(left, top, width, height) {
      this.$store.commit("updateWidgetAttrs", {
        left,
        top,
        width,
        height,
        cid: this.widget.cid
      })
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
      this.updateHint(true, `${width}x${height}`)
      this.$store.commit("setRuler", {
        shadow: { x: left, y: top, width, height }
      })
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
      this.$store.commit('setShowHelpLine',false)
    },
    onActivated() {
      this.$store.commit("setCurrentWidgetId", this.widget.cid)
      this.$store.commit("updateWidget", { active: true, cid: this.widget.cid })
      undoManager.saveApplyChange()
    },
    onDeactivated() {
      this.$store.commit("setCurrentWidgetId", "")
      this.$store.commit("updateWidget", { active: false, cid: this.widget.cid })
    },
    updateHint(show, text) {
      this.$store.commit("setHint", {show,text})
    },
    dblclick( evt) {
      console.log(evt, "a----")
      const item = this.widget
      if (isGroup(this.widget)) {
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
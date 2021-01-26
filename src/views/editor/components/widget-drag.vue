<template>
  <div class="widget-drag-con">
    <vue-draggable-resizable
      v-for="widget in widgets"
      :key="widget.cid"
      class="my-drag"
      :w="widget.attrs.width"
      :h="widget.attrs.height"
      :x="widget.attrs.left"
      :y="widget.attrs.top"
      :r="widget.attrs.rotate"
      :z="widget.attrs.zIndex"
      :active.sync="widget.active"
      @dragstart="onDragStart"
      @dragging="(left,top)=>onDrag(left,top,widget)"
      @rotating="rotate => onRotate(rotate, widget)"
      @resizestart="
        (left, top, width, height) =>
          onResizeStart(left, top, width, height, widget)
      "
      @resizing="
        (left, top, width, height) => onResize(left, top, width, height, widget)
      "
      @dragstop="onDragStop(widget)"
      @resizestop="onResizeStop(widget)"
      @rotatestop="onRotateStop"
      @activated="onAcivated(widget)"
      @deactivated="onDeactivated(widget)"
      @dblclick.native="dblclick(widget,$event)"
    />
  </div>
</template>
<script>
import VueDraggableResizable from "@c/drag-resize/vue-draggable-resizable"
import undoManager from "@u/undo-manager"
import helpComputed from "@/mixins/help-computed"
import helpMethods from "@/mixins/help-methods"
import { cloneDeep } from "lodash"
import { isGroup,findWidgetChildren,clickWhichWidget,findWidgetById } from "@u/deal"
import config from "@/config"
export default {
  name: "WidgetDrag",
  components: {
    VueDraggableResizable
  },
  mixins: [helpComputed,helpMethods],
  computed: {
    widgets() {
      // return this.selectWidgets
      return this.currentPage.widgets
    },
  },
  methods: {
    onDragStart(left, top) {
      this.startDragLeft = left
      this.startDargTop = top
      if (this.selectWidgets.length === 1 && isGroup(this.selectWidgets[0])) {
        this.selectWidgetsCopy = findWidgetChildren(this.currentPage.widgets,this.selectWidgets[0].cid)
      } else {
        this.selectWidgetsCopy = cloneDeep(this.selectWidgets)
      }
    },
    onDrag(left, top, widget) {
      if (this.selectWidgets.length === 1) {
        this.$store.commit("updateWidgetAttrs", {
          left,
          top,
          cid: widget.cid
        })
        this.updateHint(true, `${left},${top}`)
        const { rotate, width, height } = widget.attrs
        if (rotate % 180 == 0) {
          this.$store.commit("setShowHelpLine", true)
        }
        this.$store.commit("setRuler", {
          shadow: { x: left, y: top, width, height }
        })
      } 
      const disLeft = left - this.startDragLeft
      const disTop = top - this.startDargTop
      console.log(disLeft,disTop)
      if(this.selectWidgetsCopy) {
        this.selectWidgetsCopy.forEach(item => {
          this.$store.commit("updateWidgetAttrs", {
            left: item.attrs.left + disLeft,
            top: item.attrs.top + disTop,
            cid: item.cid
          })
        })
      }
    },
    onResizeStart(left, top, width, height, widget) {
      this.startResizeWidth = width
      this.startResizeHeight = height
      const widgetChildren = findWidgetChildren(this.currentPage.widgets,widget.cid)
      this.groupWidgetChildrenCopy = cloneDeep(widgetChildren)
    },
    onResize(left, top, width, height, widget) {
      this.$store.commit("updateWidgetAttrs", {
        left,
        top,
        width,
        height,
        cid: widget.cid
      })
      if (isGroup(widget)) {
        this.groupWidgetChildrenCopy.forEach(item => {
          let rateW = item.attrs.width / this.startResizeWidth
          let rateH = item.attrs.height / this.startResizeHeight
          const disW = width - this.startResizeWidth
          const disH = height - this.startResizeHeight
          let obj = {
            width: parseInt(width * rateW),
            height: parseInt(height * rateH)
          }
          if (item.attrs.left - left != 0) {
            obj.left = parseInt(disW - obj.width + item.attrs.left + item.attrs.width)
          }
          if (item.attrs.top - top != 0) {
            obj.top = parseInt(disH - obj.height + item.attrs.top + item.attrs.height)
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
    onAcivated(widget) {
      console.log(widget,"d------")
    },
    dblclick(widget,evt) {
      let { x, y } = evt
      const ele = document.querySelector(".viewport")
      const { left, top } = ele.getBoundingClientRect()
      x = x - left
      y = y - top
      const editableWidetList = config.editableWidetList
      let {cname} = widget
      const resWidget = clickWhichWidget(this.currentPage.widgets,widget,{x,y})
      console.log(resWidget,'c-----',widget)
      if(resWidget) {
        cname = resWidget.cname
        this.onDeactivated(widget)
        this.$store.commit("updateWidget", { active: true,  cid: resWidget.cid })
        // if(editableWidetList.includes( resWidget.cname)) {
        //   this.$store.commit("setTextEditor", { show: true, widget: resWidget})
        // }
      } else {
        if(editableWidetList.includes(cname)) {
          this.onDeactivated(widget)
          this.$store.commit("setTextEditor", { show: true, widget})
        }
      }
    },
    onRotate(rotate, widget) {
      this.$store.commit("updateWidgetAttrs", {
        rotate,
        cid: widget.cid
      })
      this.updateHint(true, `${rotate}`)
    },
    onResizeStop(widget) {
      undoManager.saveApplyChange()
      this.updateHint(false, "")
      this.calculateGroup(widget)
    },
    onRotateStop() {
      undoManager.saveApplyChange()
      this.updateHint(false, "")
    },
    onDragStop(widget) {
      undoManager.saveApplyChange()
      this.updateHint(false, "")
      this.$store.commit("setShowHelpLine", false)
      this.calculateGroup(widget)
    },
    onDeactivated(widget) {
      this.$store.commit("updateWidget", {
        active: false,
        cid: widget.cid
      })
      let {width,height} = this.currentPage
      this.$store.commit("setRuler", {
        shadow: { x: 0, y: 0, width, height }
      })
    },
    updateHint(show, text) {
      this.$store.commit("setHint", { show, text })
    },
    calculateGroup(widget) {
      if(widget.pid) {
        let widgets = findWidgetChildren(this.currentPage.widgets,widget.pid)
        const attrs = this.calculateSelectWidgets(widgets)
        const {left,top,width,height} = attrs
        this.$store.commit("updateWidgetAttrs",{cid:widget.pid,left,top,width,height})
      }
    },
  }
}
</script>
<style lang="less">
.widget-drag-con {
  pointer-events: none;
  width:100%;
  height:100%;
  .my-drag {
    cursor: move;
    pointer-events:auto;
    .handle {
      width: 18px;
      height: 18px;
      border: none;
      // pointer-events:auto;
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
}
</style>

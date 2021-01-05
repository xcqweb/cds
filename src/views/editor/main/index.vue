<template>
  <div class="view-con-wrap">
    <div class="view-con" ref="viewCon" @scroll="handleScroll">
      <div class="viewport-con" :style="portConStyle">
        <div
          class="viewport"
          :style="portStyle"
          ref="viewport"
          @contextmenu.prevent="openContextmenu"
        >
          <div class="canvas-pos">
            <!-- 提示框 -->
            <hint :text="hintText" :show="showHint" />
            <!-- 框选组件 -->
            <selection-widget />
            <!-- 辅助线 -->
            <widget-help-line :show="showHelpLine" />
          </div>
          <div class="canvas-pos" :style="widgetConStyle">
            <div class="goup-list" @dragover.prevent @drop="drop">
              <vue-draggable-resizable
                class="group-item"
                v-for="item in widgets"
                :w="item.attrs.width"
                :h="item.attrs.height"
                :x="item.attrs.left"
                :y="item.attrs.top"
                :r="item.attrs.rotate"
                :parent="true"
                :active.sync="item.active"
                :key="item.cid"
                :id="item.cid"
                @rotating="onRotate"
                @dragging="onDrag"
                @resizing="onResize"
                @resizestop="onResizeStop"
                @dragstop="onDragStop"
                @rotatestop="onRotateStop"
                @activated="onActivated"
                @deactivated="onDeactivated"
                @dblclick.native="dblclick(item,$event)"
              >
                <component :is="item.cname" v-bind="item.attrs" v-if="item.children">
                  <vue-draggable-resizable
                    class="group-item"
                    v-for="d in item.children"
                    :w="d.attrs.width"
                    :h="d.attrs.height"
                    :x="d.attrs.left"
                    :y="d.attrs.top"
                    :r="d.attrs.rotate"
                    :parent="true"
                    :active.sync="d.active"
                    :key="d.cid"
                    :id="d.cid"
                    @rotating="onRotate"
                    @dragging="onDrag"
                    @resizing="onResize"
                    @resizestop="onResizeStop"
                    @dragstop="onDragStop"
                    @rotatestop="onRotateStop"
                    @activated="onActivated"
                    @deactivated="onDeactivated"
                    @dblclick.native="dblclick(d,$event)">
                    <component :is="d.cname" v-bind="d.attrs"/>
                  </vue-draggable-resizable>
                </component>
                <component :is="item.cname" v-bind="item.attrs" v-else/>
              </vue-draggable-resizable>
            </div>
          </div>
        </div>
      </div>
    </div>
    <custom-contextmenu ref="open"></custom-contextmenu>
  </div>
</template>

<script>
import { createGridBg } from "@u/grid-bg"
import { throttle } from "lodash"
import components from "@/widgets/index"
import undoManager from "@u/undo-manager"
import customContextmenu from "@/components/custom-contextmenu"
import VueDraggableResizable from "@c/drag-resize/vue-draggable-resizable"
import Hint from "@c/hint/"
import SelectionWidget from "@c/selection-widget/"
import WidgetHelpLine from "@c/widget-help-line/"
import baseComponent from "@/mixins/base-editor"
import {arrayToTree} from "@u/deal"
export default {
  name: "EditorMain",
  mixins: [baseComponent],
  components: {
    VueDraggableResizable,
    SelectionWidget,
    WidgetHelpLine,
    Hint,
    customContextmenu,
    ...components
  },
  computed: {
    widgets() {
      let widgets = this.$store.getters.currentPage.widgets
       widgets = arrayToTree(widgets)
      return widgets
    },
    portConStyle() {
      const { scale, width, height } = this.$store.state.apply
      let conWidth = width * 2
      let conHeight = height * 4
      if (scale > 1) {
        conWidth = conWidth * scale
        conHeight = conHeight * scale
      }
      return {
        width: conWidth + "px",
        height: conHeight + "px"
      }

    },
    portStyle() {
      const { size, color } = this.$store.getters.currentPage.grid
      const { scale } = this.$store.state.apply
      const { width, height, backgroundColor } = this.$store.getters.currentPage
      return {
        width: width + "px",
        height: height + "px",
        backgroundImage: createGridBg(size, color, scale),
        backgroundColor
      }
    },
    currentWidget() {
      return this.$store.getters.currentWidget
    },
    widgetConStyle() {
      const { scale } = this.$store.state.apply
      return {
        transform: `scale(${scale})`
      }
    },
    selectWidgetsCount() {
      return this.$store.getters.selectWidgets.length
    }
  },
  watch:{
    selectWidgetsCount(val) {
      if(val>1) {
        this.showHelpLine = false
      }
    }
  },
  data() {
    return {
      contextmenuVisible: false,
      contextmenuPosition: { x: 0, y: 0 },
      menuList: [],
      hintText: "", // 提示信息
      showHint: false, // 是否显示提示
      showHelpLine: false
    }
  },
  created() {
    this.$bus.$on("handleCornerClick", () => {
      this.centerView()
    })
    this.init()
  },
  mounted() {
    this.$nextTick(() => {
      undoManager.saveApplyChange()
    })
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeFun)
  },
  methods: {
    openContextmenu(event) {
      this.$refs.open.openContextmenu(event)
    },
    init() {
      this.dealRulerSize()
      window.addEventListener("resize", this.resizeFun)
    },
    drop(evt) {
      const { dataTransfer, x, y } = evt // 拖拽结束，鼠标与文档的距离
      const item = JSON.parse(dataTransfer.getData("item"))
      const { dx, dy } = item
      let { left, top } = this.portProps() // 画布与文档的距离
      item.left = x - left - dx
      item.top = y - top - dy
      this.$store.commit("widgetAdd", { ...item })
      undoManager.saveApplyChange()
    },
    resizeFun: throttle(function() {
      // 窗口大小变化
      this.centerView()
      this.dealRulerSize()
      this.handleScroll()
    }, 100),
    centerView() {
      // 居中视图
      this.$nextTick(() => {
        const ele = this.$refs.viewCon
        const { centerX, centerY } = this.viewProps()
        ele.scrollLeft = centerX
        ele.scrollTop = centerY
      })
    },
    viewProps() {
      // 滚动容器的属性
      const ele = this.$refs.viewCon
      const { width, height, left, top } = ele.getBoundingClientRect()
      const { width: conW, height: conH } = this.portConStyle
      const res = {
        scrollLeft: ele.scrollLeft,
        scrollTop: ele.scrollTop,
        centerX: (parseFloat(conW) - width) / 2,
        centerY: (parseFloat(conH) - height) / 2,
        left,
        top,
        width,
        height
      }
      return res
    },
    portProps() {
      // 视图层的属性
      const ele = this.$refs.viewport
      const { width, height, left, top } = ele.getBoundingClientRect()
      return {
        width,
        height,
        left,
        top
      }
    },
    dealRulerSize() {
      // 刻度尺大小
      this.$nextTick(() => {
        const { width, height } = this.viewProps()
        this.$store.commit("setRulerSize", { width, height })
      })
    },
    dealRulerStartPos() {
      // 刻度尺起始坐标
      const { scale } = this.$store.state.apply
      const { left: viewLeft, top: viewTop } = this.viewProps()
      const { left: portLeft, top: portTop } = this.portProps()
      const x = parseInt((viewLeft - portLeft) / scale)
      const y = parseInt((viewTop - portTop - 4) / scale)
      this.$store.commit("setRulerStartPos", { x, y })
    },
    dealRulerCorner() {
      // 刻度尺左上角
      const { scrollLeft, scrollTop, centerX, centerY } = this.viewProps()
      const distanceX = Math.abs(centerX - scrollLeft) > 1
      const distanceY = Math.abs(centerY - scrollTop) > 1
      this.$store.commit("setRulerCornerActive", distanceX || distanceY)
    },
    handleScroll: throttle(function() {
      // 滚动处理
      this.dealRulerCorner()
      this.dealRulerStartPos()
    }, 100),
    onRotate(rotate) {
      this.$store.commit("updateWidgetAttrs", { rotate })
      this.showHint = true
      this.hintText = `${rotate}`
    },
    onDrag(left, top) {
      this.$store.commit("updateWidgetAttrs", { left, top })
      this.showHint = true
      this.hintText = `${left},${top}`
      const { rotate } = this.currentWidget.attrs
      if (rotate % 180 == 0) {
        this.showHelpLine = true
      }
    },
    onResize(left, top, width, height) {
      this.$store.commit("updateWidgetAttrs", { left, top, width, height })
      this.showHint = true
      this.hintText = `${width}x${height}`
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
    onActivated() {
      this.showHint = false
    },
    onDeactivated() {

    },
    dblclick(item,evt) {
      console.log(item,evt)
    }
  }
}
</script>
<style lang="less">
@import "~vue-context/dist/css/vue-context.css";
.view-con-wrap {
  position: fixed;
  top: 52px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background 0.2s ease-in-out 0s;
  background-color: rgb(245, 245, 245);
  .view-con {
    position: absolute;
    top: 21px;
    right: 230px;
    left: calc(210px + 21px);
    bottom: 0;
    overflow: auto;
  }
  .viewport-con {
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .viewport {
    position: absolute;
    width: 100%;
    height: 100%;
    .canvas-pos {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }
    .goup-list {
      position: relative;
      z-index: 1;
      height: 100%;
    }
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
        background: url("../../../assets/images/icon/resize-dot.svg") 100% 100%;
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
          background: url("../../../assets/images/icon/rotate-dot.svg") 100%
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
}
</style>
<style lang="less" scoped></style>

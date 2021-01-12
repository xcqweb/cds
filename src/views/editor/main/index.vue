<template>
  <div class="view-con-wrap">
    <div
      class="view-con"
      ref="viewCon"
      @scroll="handleScroll"
      v-if="isApplyInit"
    >
      <div class="viewport-con" :style="portConStyle">
        <div class="viewport" :style="portStyle" ref="viewport">
          <div class="canvas-main" :style="widgetConStyle">
            <div class="goup-list" @dragover.prevent @drop="drop">
              <drag-widget
                v-for="widget in widgets"
                :key="widget.cid"
                :widget="widget"
              />
            </div>
          </div>
          <div class="canvas-sub">
            <!-- 提示框 -->
            <hint />
            <!-- 框选组件 -->
            <selection-widget />
            <!-- 辅助线 -->
            <widget-help-line />
            <!-- 组合选择框 -->
            <group-selection style="z-index:99999;" />
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      loading...
    </div>
  </div>
</template>

<script>
import { createGridBg } from "@u/grid-bg"
import { throttle } from "lodash"
import undoManager from "@u/undo-manager"
import Hint from "@c/hint/"
import SelectionWidget from "@c/selection-widget/"
import WidgetHelpLine from "@c/widget-help-line/"
import helpComputed from "@/mixins/help-computed"
import arrayToTree from "array-to-tree"
import DragWidget from "@c/drag-resize/drag-widget"
import GroupSelection from "@c/group-selection/"
import components from "@/views/widgets/index"
export default {
  name: "EditorMain",
  mixins: [helpComputed],
  components: {
    SelectionWidget,
    WidgetHelpLine,
    Hint,
    DragWidget,
    GroupSelection,
    ...components
  },
  computed: {
    isApplyInit() {
      return this.$store.state.isApplyInit
    },
    widgets() {
      let widgets = this.currentPage.widgets
      widgets = arrayToTree(widgets, { parentProperty: "pid", customID: "cid" })
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
      const { size, color } = this.currentPage.grid
      const { scale } = this.$store.state.apply
      const { width, height, backgroundColor } = this.currentPage
      return {
        width: width + "px",
        height: height + "px",
        backgroundImage: createGridBg(size, color, scale),
        backgroundColor
      }
    },
    widgetConStyle() {
      const { scale } = this.$store.state.apply
      return {
        transform: `scale(${scale})`
      }
    },
    selectWidgetsCount() {
      return this.selectWidgets.length
    }
  },
  watch: {
    selectWidgetsCount(val) {
      if (val > 1) {
        this.$store.commit("setShowHelpLine", false)
      }
    },
    isApplyInit(val) {
      if (val) {
        this.init()
      }
    }
  },
  data() {
    return {}
  },
  created() {
    this.$bus.$on("handleCornerClick", () => {
      this.centerView('aa')
    })
    window.addEventListener("resize", this.resizeFun)
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
    init() {
      this.dealRulerSize()
      this.centerView()
    },
    resizeFun: throttle(function() {
      // 窗口大小变化
      this.centerView()
      this.dealRulerSize()
      this.handleScroll()
    }, 100),
    centerView(str) {
      // 居中视图
      this.$nextTick(() => {
        console.log(ele,str)
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
        this.$store.commit("setRuler", { width, height })
      })
    },
    dealRulerStartPos() {
      // 刻度尺起始坐标
      const { scale } = this.$store.state.apply
      const { left: viewLeft, top: viewTop } = this.viewProps()
      const { left: portLeft, top: portTop } = this.portProps()
      const x = parseInt((viewLeft - portLeft) / scale)
      const y = parseInt((viewTop - portTop - 4) / scale)
      this.$store.commit("setRuler", { startPos: { x, y } })
    },
    dealRulerCorner() {
      // 刻度尺左上角
      const { scrollLeft, scrollTop, centerX, centerY } = this.viewProps()
      const distanceX = Math.abs(centerX - scrollLeft) > 1
      const distanceY = Math.abs(centerY - scrollTop) > 1
      this.$store.commit("setRuler", { cornerActive: distanceX || distanceY })
    },
    handleScroll: throttle(function() {
      // 滚动处理
      this.dealRulerCorner()
      this.dealRulerStartPos()
    }, 100)
  }
}
</script>
<style lang="less">
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
    .canvas-main {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }
    .canvas-sub {
      .canvas-main;
      pointer-events: none;
    }
  }
  .goup-list {
    position: relative;
    z-index: 1;
    height: 100%;
  }
  .group-item {
    position: absolute;
    cursor: move;
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
}
</style>
<style lang="less" scoped></style>

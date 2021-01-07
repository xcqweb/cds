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
            <gt-drag-resize
              class="goup-list" 
              :widgets="widgets"
              @updateHelpLine="updateHelpLine"
              @updateHint="updateHint"
            />
          </div>
        </div>
      </div>
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
import { arrayToTree } from "@u/deal"
import GtDragResize from "./components/gt-drag-resize"
export default {
  name: "EditorMain",
  mixins: [helpComputed],
  components: {
    SelectionWidget,
    WidgetHelpLine,
    Hint,
    GtDragResize
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
    }, 100),
    updateHint(showHint, hintText) {
      this.showHint = showHint
      this.hintText = hintText
    },
    updateHelpLine(val) {
      this.showHelpLine = val
    }
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
    .canvas-pos {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }
  }
  .goup-list {
    position: relative;
    z-index: 1;
    height: 100%;
  }
}
</style>
<style lang="less" scoped></style>

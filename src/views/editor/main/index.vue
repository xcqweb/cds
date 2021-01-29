<template>
  <div class="view-con-wrap">
    <div
      class="view-con"
      ref="viewCon"
      @scroll="handleScroll"
      :style="viewConStyle"
      @dragover.prevent @drop="drop"
    >
      <div class="viewport-con" :style="portConStyle">
        <div class="viewport" :style="portStyle" ref="viewport">
          <div class="canvas-main">
            <div class="group-list">
              <widget-item
                v-for="widget in widgets"
                :key="widget.cid"
                :widget="widget"
              />
            </div>
          </div>
          <div class="canvas-sub">
            <!-- 控件拖拽框 -->
            <widget-drag />
            <!-- 提示框 -->
            <hint />
            <!-- 框选组件 -->
            <selection-widget />
            <!-- 辅助线 -->
            <widget-help-line />
            <text-editor v-if="isShowTextEditor" />
            <contextmenu />
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
import arrayToTree from "array-to-tree"
import WidgetItem from "./components/widget-item"
import components from "@/views/widgets/index"
import Contextmenu from "./components/contextmenu"
import WidgetDrag from "./components/widget-drag"
import TextEditor from "@c/text-editor"
export default {
  name: "EditorMain",
  mixins: [helpComputed],
  components: {
    SelectionWidget,
    WidgetHelpLine,
    Hint,
    WidgetItem,
    Contextmenu,
    WidgetDrag,
    TextEditor,
    ...components
  },
  computed: {
    isShowTextEditor() {
      return this.textEditor.show
    },
    widgets() {
      let widgets = this.currentPage.widgets
      widgets = arrayToTree(widgets, { parentProperty: "pid", customID: "cid" })
      return widgets
    },
    scale() {
      return this.$store.state.apply.scale
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
      const { scale, gridEnable } = this.$store.state.apply
      const {
        width,
        height,
        backgroundColor,
        backgroundImage
      } = this.currentPage
      const res = {
        width: width + "px",
        height: height + "px",
        backgroundColor,
        transform: `scale(${scale})`,
      }
      if (backgroundImage) {
        res.background = `url(${this.$imgUrl(backgroundImage)}) no-repeat`
        res.backgroundSize = "cover"
      } else {
        if (gridEnable) {
          res.backgroundImage = createGridBg(size, color, scale)
        }
      }
      return res
    },
    ruleEnable() {
      return this.$store.state.apply.ruleEnable
    },
    viewConStyle() {
      let left = 21 + 250
      let top = 21
      if (!this.ruleEnable) {
        left = 250
        top = 0
      }
      return {
        left: left + "px",
        top: top + "px"
      }
    }
  },
  watch:{
    scale() {
      this.centerView()
    },
  },
  data() {
    return {}
  },
  created() {
    this.$bus.$on("handleCornerClick", () => {
      this.centerView()
    })
    window.addEventListener("resize", this.resizeFun)
  },
  mounted() {
    this.$nextTick(() => {
      this.init()
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
    }, 100)
  }
}
</script>
<style lang="less">
.view-con-wrap {
  position: fixed;
  top: 50px;
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
    left: calc(250px + 21px);
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
      z-index:1;
      .canvas-main;
      pointer-events: none;
    }
  }
  .group-list {
    position: relative;
    z-index: 1;
    height: 100%;
  }
}
</style>
<style lang="less" scoped></style>

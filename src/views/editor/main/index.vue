<template>
  <div class="view-con-wrap">
    <div class="view-con" ref="viewCon" @scroll="handleScroll">
      <div class="viewport-con" :style="portConStyle">
        <div class="viewport" :style="portStyle" ref="viewport">
          <div class="goup-list" @dragover.prevent @drop="drop">
            <component
              class="group-item"
              v-for="item in widgets"
              :key="item.id"
              :is="item.cname"
              v-bind="item.attrs"
              @click="clickFun"
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
import components from "@/widgets/index"
import undoManager from "@u/undo-manager"
export default {
  name: "EditorMain",
  components: {
    ...components
  },
  computed: {
    widgets() {
      return this.$store.getters.currentPage.widgets
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
        backgroundColor,
        transform: `scale(${scale})`
      }
    }
  },
  data() {
    return {}
  },
  created() {
    this.$bus.$on("handleCornerClick", () => {
      this.centerView()
    })
    this.init()
  },
  mounted() {
    this.$nextTick(()=>{
      undoManager.saveApplyChange()
    })
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeFun)
  },
  methods: {
    clickFun() {
      console.log("a----------b")
    },
    init() {
      this.dealRulerSize()
      window.addEventListener("resize", this.resizeFun)
    },
    drop(evt) {
      const { dataTransfer, x, y } = evt // 拖拽结束，鼠标与文档的距离
      const item = JSON.parse(dataTransfer.getData("item"))
      const {dx, dy} = item
      let {left,top} = this.portProps() // 画布与文档的距离
      item.left = x - left - dx
      item.top = y - top - dy
      this.$store.commit("widgetAdd", {...item})
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
    position: relative;
    .goup-list {
      position: relative;
      z-index: 1;
      height: 100%;
    }
    .group-item {
      position: absolute;
    }
  }
}
</style>
<style lang="less" scoped></style>

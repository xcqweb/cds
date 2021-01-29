<template>
  <div class="selection-con" :style="objStyle" v-show="isShowSelection" />
</template>
<script>
export default {
  name: "SelectionWidget",
  data() {
    return {
      objStyle: {}
    }
  },
  computed: {
    isShowSelection: {
      get() {
        return this.$store.state.isShowSelection
      },
      set(val) {
        this.$store.commit("setIsShowSelection", val)
      }
    }
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      this.el = document.querySelector(".view-con")
      this.el.addEventListener("mousedown", this.mousedown, false)
      this.el.addEventListener("mousemove", this.mousemove, false)
      document.body.addEventListener("mouseup", this.mouseup, false)
    })
  },
  beforeDestroy() {
    document.body.removeEventListener("mouseup", this.mouseup, false)
    this.el.removeEventListener("mousedown", this.mousedown, false)
    this.el.removeEventListener("mousemove", this.mousemove, false)
  },
  methods: {
    mousedown(evt) {
      const { x, y, target } = evt
      const clsList = target.classList
      if (clsList.contains("group-list") || clsList.contains("viewport-con")) {
        this.viewBgMoving = true
        this.isShowSelection = true
        const ele = document.querySelector(".viewport")
        const { left, top } = ele.getBoundingClientRect()
        this.viewportLeft = left
        this.viewportTop = top
        this.startX = x
        this.startY = y
      }
    },
    mousemove(evt) {
      if (this.viewBgMoving) {
        let { x, y } = evt
        let minX = Math.min(x, this.startX)
        let minY = Math.min(y, this.startY)
        const width = Math.abs(x - this.startX)
        const height = Math.abs(y - this.startY)
        x = minX - this.viewportLeft
        y = minY - this.viewportTop
        this.checkContainWidgets({ x, y, width, height })
        this.objStyle = {
          left: `${x}px`,
          top: `${y}px`,
          width: `${width}px`,
          height: `${height}px`
        }
      }
    },
    checkContainWidgets(shadowRect) {
      const widgets = this.$store.getters.currentPage.widgets
      let res = false
      widgets.forEach(item => {
        const { left, top, width, height } = item.attrs
        res =
          this.checkPointInWidget(left, top, shadowRect) ||
          this.checkPointInWidget(left + width, top, shadowRect) ||
          this.checkPointInWidget(left, top + height, shadowRect) ||
          this.checkPointInWidget(left + width, top + height, shadowRect)
        res = res && item.pid == ""
        this.$set(item, "active", res)
      })
    },
    checkPointInWidget(tx, ty, shadowRect) {
      // 目标有一个角的坐标出现在阴影框内部就算选中
      const { x, y, width, height } = shadowRect
      return tx > x && tx < x + width && ty > y && ty < y + height
    },
    hideSelection() {
      this.isShowSelection = false
      this.objStyle.left = "-10000px"
      this.objStyle.width = 0
      this.objStyle.height = 0
    },
    mouseup() {
      this.viewBgMoving = false
      this.hideSelection()
    }
  }
}
</script>
<style lang="less" scoped>
.selection-con {
  z-index: 1;
  position: absolute;
  pointer-events: none;
  background: rgba(38, 168, 255, 0.1);
  border: 1px solid rgb(30, 152, 234);
}
</style>

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
      if (this.el) {
        this.el.addEventListener("mousedown", this.mousedown)
        this.el.addEventListener("mousemove", this.mousemove)
        document.body.addEventListener("mouseup", this.mouseup)
      }
    })
  },
  beforeDestroy() {
    document.body.removeEventListener("mouseup", this.mouseup)
    this.el.removeEventListener("mousedown", this.mousedown)
    this.el.removeEventListener("mousemove", this.mousemove)
  },
  methods: {
    mousedown(evt) {
      this.viewBgMoving = true
      this.isShowSelection = true
      const { x, y } = evt
      const ele = document.querySelector(".viewport")
      const { left, top } = ele.getBoundingClientRect()
      this.viewportLeft = left
      this.viewportTop = top
      this.startX = x
      this.startY = y
      this.$store.commit("setsSelectWidgets", [])
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
        this.checkContainWidgets(x, y, width, height)
        this.objStyle = {
          left: `${x}px`,
          top: `${y}px`,
          width: `${width}px`,
          height: `${height}px`
        }
      }
    },
    checkContainWidgets(x, y, width, height) {
      const widgets = this.$store.getters.currentPage.widgets
      let res = false
      widgets.forEach(item => {
        const { left, top, width: w, height: h } = item.attrs
        res =
          left > x && left + w < x + width && top > y && top + h < y + height
        if (res) {
          this.$set(item, "active", res)
        }
      })
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

<template>
  <div :style="objStyle">
    <template v-if="widget.active">
      <div
        class="handle-line"
        :style="startStyle"
        @mousedown.stop="mousedown($event, 'start')"
      />
      <div
        class="handle-line"
        :style="endStyle"
        @mousedown.stop="mousedown($event, 'end')"
      />
    </template>
  </div>
</template>
<script>
const cursors = [
  "e-resize",
  "se-resize",
  "s-resize",
  "sw-resize",
  "w-resize",
  "nw-resize",
  "n-resize",
  "ne-resize"
]
export default {
  name: "DragLine",
  props: {
    widget: Object
  },
  computed: {
    objStyle() {
      const { left, top, width, height } = this.widget.attrs
      return {
        position: "absolute",
        top: `${top}px`,
        left: `${left}px`,
        width: `${width}px`,
        height: `${height}px`
      }
    },
    rotate() {
      return this.widget.attrs.rotate
    },
    cursor() {
      let resIndex = Math.floor((this.rotate + 23) / 45)
      if (resIndex >= 8) {
        resIndex = 0
      }
      return cursors[resIndex]
    },
    startStyle() {
      const { width } = this.widget.attrs
      let left = -9
      let top = -9
      if ((this.rotate > 90 && this.rotate < 180) || this.rotate > 270) {
        left = width - 9
      }
      return {
        cursor: this.cursor,
        left: `${left}px`,
        top: `${top}px`
      }
    },
    endStyle() {
      const { width, height } = this.widget.attrs
      let left = width - 9
      let top = height - 9
      if ((this.rotate > 90 && this.rotate < 180) || this.rotate > 270) {
        left = -9
      }
      return {
        cursor: this.cursor,
        left: `${left}px`,
        top: `${top}px`
      }
    }
  },
  data() {
    return {}
  },
  mounted() {
    this.elBase = document.querySelector(".view-con")
    this.elBase.addEventListener("mouseup", this.mouseup, true)
    this.elBase.addEventListener("mousemove", this.mousemove, true)
  },
  beforeDestroy() {
    this.elBase.removeEventListener("mouseup", this.mouseup, true)
    this.elBase.removeEventListener("mousemove", this.mousemove, true)
  },
  methods: {
    mousedown(evt, type) {
      this.resizing = true
      this.getBasePos()
      const { left, top, width, height } = this.widget.attrs
      if (this.rotate <= 90) {
        this.spos = { x: left, y: top }
        this.epos = { x: left + width, y: top + height }
      } else if (this.rotate > 90 && this.rotate <= 180) {
        this.spos = { x: left + width, y: top }
        this.epos = { x: left, y: top + height }
      } else if (this.rotate >= 180 && this.rotate < 270) {
        this.spos = { x: left + width, y: top + height }
        this.epos = { x: left, y: top }
      } else {
        this.spos = { x: left, y: top + height }
        this.epos = { x: left + width, y: top }
      }
      if (this.rotate < 180) {
        this.type = type
      } else {
        if (type == "start") {
          this.type = "end"
        } else {
          this.type = "start"
        }
      }
    },
    getBasePos() {
      const ele = document.querySelector(".viewport")
      const { left, top } = ele.getBoundingClientRect()
      this.basePos = { x: left, y: top }
    },
    mousemove(evt) {
      if (this.resizing) {
        let { x, y } = evt
        let left
        let top
        let temp = { x: x - this.basePos.x, y: y - this.basePos.y }
        if (this.type == "end") {
          let width = temp.x - this.spos.x
          let height = temp.y - this.spos.y
          let rotate = this.getAngle(width, height)
          width = Math.abs(width)
          height = Math.abs(height)
          width = Math.max(1, width)
          height = Math.max(1, height)
          if (rotate >= 90 && rotate <= 180) {
            left = this.spos.x - width
            top = this.spos.y
          } else if (rotate > 180 && rotate <= 270) {
            left = this.spos.x - width
            top = this.spos.y - height
          } else if (rotate > 270) {
            top = this.spos.y - height
            left = this.spos.x
          } else {
            left = this.spos.x
            top = this.spos.y
          }
          this.$store.commit("updateWidgetAttrs", {
            width,
            height,
            left,
            top,
            cid: this.widget.cid,
            rotate
          })
        } else {
          let width = this.epos.x - temp.x
          let height = this.epos.y - temp.y
          let rotate = this.getAngle(width, height)
          width = Math.abs(width)
          height = Math.abs(height)
          width = Math.max(1, width)
          height = Math.max(1, height)
          if (rotate >= 90 && rotate <= 180) {
            left = this.epos.x
            top = this.epos.y - height
          } else if (rotate > 180 && rotate <= 270) {
            left = this.epos.x
            top = this.epos.y
          } else if (rotate > 270) {
            top = this.epos.y
            left = this.epos.x - width
          } else {
            left = this.epos.x - width
            top = this.epos.y - height
          }
          this.$store.commit("updateWidgetAttrs", {
            width,
            height,
            left,
            top,
            cid: this.widget.cid,
            rotate
          })
          this.$store.commit("setRuler", {
            shadow: { x: left, y: top, width, height }
          })
        }
      }
    },
    mouseup() {
      this.resizing = false
    },
    getAngle(x, y) {
      let theta = Math.atan2(y, x) // range (-PI, PI]
      theta = Math.round((180 / Math.PI) * theta) // rads to degs, range (-180, 180]
      if (theta < 0) theta = 360 + theta // range [0, 360)
      return theta
    }
  }
}
</script>
<style lang="less" scoped>
.help-hover-cls {
  position: absolute;
  top: -8px;
  left: 0;
  min-height: 16px;
  cursor: move;
  pointer-events: auto;
}
.handle-line {
  position: absolute;
  width: 18px;
  height: 18px;
  border: none;
  z-index: 1;
  pointer-events: auto;
  background: url("~@/assets/images/icon/resize-dot.svg") 100% 100%;
}
</style>

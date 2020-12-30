<template>
  <div class="selection-con" :style="objStyle" v-show="show"/>
</template>
<script>
export default {
  name: "SelectionWidget",
  data() {
    return {
      show:false,
      objStyle:{},
    }
  },
  created() {

  },
  mounted() {
    this.$nextTick(()=>{
      this.el = document.querySelector(".view-con")
      if(this.el) {
        this.el.addEventListener('mousedown',this.mousedown)
        this.el.addEventListener('mousemove',this.mousemove)
        document.body.addEventListener('mouseup',this.mouseup)
      }
    })
  },
  beforeDestroy() {
    document.body.removeEventListener('mouseup',this.mouseup)
    this.el.removeEventListener('mousedown',this.mousedown)
    this.el.removeEventListener('mousemove',this.mousemove)
  },
  methods: {
    mousedown(evt) {
      this.viewBgMoving = true
      this.show = true
      const { x, y } = evt
      const ele = document.querySelector('.viewport')
      const { left, top } = ele.getBoundingClientRect()
      this.viewportLeft = left
      this.viewportTop = top
      this.startX = x 
      this.startY = y
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
        this.objStyle = {
          left: `${x}px`,
          top: `${y}px`,
          width: `${width}px`,
          height: `${height}px`,
        }
      }
    },
    hideSelection() {
      this.show = false
      this.objStyle.width = 0
      this.objStyle.height = 0
    },
    mouseup() {
      this.viewBgMoving = false
      this.hideSelection()
    }
  },
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

<template>
  <div class="gt-line" :style="lineStyle">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      style="overflow: visible; filter: none;"
    >
      <path
        :d="d"
        :stroke="stroke"
        :stroke-width="strokeWidth"
        :stroke-dasharray="strokeDasharray"
      />
      <path
        :d="d"
        stroke="transparent"
        stroke-width="16"
        style="pointer-events: auto;"
        @mousedown.stop="elmDown"
      />
    </svg>
  </div>
</template>
<script>
import baseWidget from "@/mixins/base-widget"
const cname = "GtLine"
export default {
  name: cname,
  mixins: [baseWidget],
  computed: {
    lineStyle() {
      return {
        ...this.styleObj,
        background:'transparent'
      }
    },
    d() {
      let mx = 0
      let my = 0
      let lx = 0
      let ly = 0
      if(this.rotate==0) {
        mx = 0
        my = 0.5
        lx = this.width
        ly = 0.5
      }else if(this.rotate>0 && this.rotate<90) {
        mx = 0
        my = 0
        lx = this.width
        ly = this.height
      }else if(this.rotate == 90) {
        mx = 0.5
        my = 0
        lx = 0.5
        ly = this.height
      } else if(this.rotate>90 && this.rotate<180) {
        mx = this.width
        my = 0
        lx = 0
        ly = this.height
      }
      else if(this.rotate ==  180) {
        mx = this.width
        my = 0.5
        lx = 0
        ly = 0.5
      } else if(this.rotate>180 && this.rotate<270) {
        mx = this.width
        my = this.height
        lx = 0
        ly = 0
      } else if(this.rotate == 270) {
        mx = 0.5
        my = this.height
        lx = 0.5
        ly = 0
      }else if(this.rotate>270) {
        mx = 0
        my = this.height
        lx = this.width
        ly = 0
      }
      return `M ${mx} ${my} L ${lx} ${ly}`
    },
    stroke() {
      return this.borderColor || "#bbb"
      
    },
    strokeWidth() {
      let res = this.borderWidth || 1
      return `${res}px`
    },
    strokeDasharray() {
      let res = []
      if(this.borderStyle == 'dotted') {
        res = [this.borderWidth*2,this.borderWidth]
      }else if(this.borderStyle == 'dashed') {
        res = [this.borderWidth,this.borderWidth]
      }
      return res.join(' ')
    }
  },
  data() {
    return {}
  },
  mounted() {
    this.elBase = document.querySelector(".view-con")
    this.leftEl = document.querySelector(".left-con")
    this.elBase.addEventListener("mousedown", this.deselect, true)
    this.leftEl.addEventListener("mousedown", this.deselect, true)
    this.elBase.addEventListener("mouseup", this.mouseup, true)
    this.elBase.addEventListener("mousemove",this.mousemove,true)
  },
   beforeDestroy() {
    this.elBase.removeEventListener("mousedown", this.deselect, true)
    this.leftEl.removeEventListener("mousedown", this.deselect, true)
    this.elBase.removeEventListener("mouseup", this.mouseup, true)
    this.elBase.removeEventListener("mousemove",this.mousemove,true)
  },
  methods: {
    elmDown(evt) {
      this.dragging = true
      let {x,y} = evt
      this.lastX = x - this.left
      this.lastY = y - this.top
      this.getBasePos()
      this.$store.commit('updateWidget',{active:true,cid:this.cid})
    },
    getBasePos() {
      const ele = document.querySelector(".viewport")
      const {left,top} = ele.getBoundingClientRect()
      this.basePos = {x:left,y:top}
    },
    deselect(e) {
      const target = e.target || e.srcElement
      if(!this.$el.contains(target) && target.classList && !target.classList.contains('handle-line')) {
        this.$store.commit('updateWidget',{active:false,cid:this.cid})
      }
    },
    mousemove(evt) {
      let { x, y } = evt
      if(this.dragging) {
        let left = x - this.lastX 
        let top = y - this.lastY
        this.$store.commit('updateWidgetAttrs',{left,top,cid:this.cid})
      }
    },
    mouseup(evt) {
      this.dragging = false
    },
  }
}
</script>
<style lang="less" scoped>
.gt-line {
  pointer-events: none;
  svg{
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transition: inherit;
    position:absolute;
  }
}
</style>

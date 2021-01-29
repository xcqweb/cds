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
        stroke-width="10"
        style="pointer-events: auto;"
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
  created() {
  },
  methods: {}
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

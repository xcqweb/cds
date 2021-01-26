<template>
  <div class="gt-line" :style="styleObj">
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
    d() {
      let lineH = this.height == 1 ? 0.5 : this.height
      let sx = 0
      let sy = lineH
      let ex = this.width
      let ey = lineH
      return `M ${sx} ${sy} L ${ex} ${ey}`
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
  created() {},
  methods: {}
}
</script>
<style lang="less" scoped>
.gt-line {
  pointer-events: none;
}
</style>

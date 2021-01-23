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
      let sx = 0
      let sy = 0.5
      let ex = 150
      let ey = 0.5
      return `M ${sx} ${sy} L ${ex} ${ey}`
    },
    stroke() {
      return `rgba(187,187,187,1)`
    },
    strokeWidth() {
      return 1
    },
    strokeDasharray() {
      return []
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

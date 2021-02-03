<template>
  <div class="gt-rect" :style="rectStyle">
    <text-con v-bind="$props" />
  </div>
</template>
<script>
import baseWidget from "@/mixins/base-widget"
import TextCon from "../../components/text-con"
const cname = "GtRect"
const borderColor = "#bbb"
const backgroundColor = "#fff"
export default {
  name: cname,
  components: {
    TextCon
  },
  mixins: [baseWidget],
  computed: {
    rectStyle() {
      let res = {}
      res.borderColor = this.borderColor || borderColor
      res.backgroundColor = this.backgroundColor || backgroundColor
      return {
        ...this.styleObj,
        ...res,
        borderStyle: this.borderStyle,
        borderWidth: `${this.borderWidth}px`,
        borderRadius: this.borderRadius
      }
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
.gt-rect {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0px;
}
</style>

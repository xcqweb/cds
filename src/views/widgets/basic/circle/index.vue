<template>
  <div class="gt-circle" :style="circleStyle">
    <text-con v-bind="$props" />
  </div>
</template>
<script>
import baseWidget from "@/mixins/base-widget"
import TextCon from "../../components/text-con"
const cname = "GtCircle"
const borderColor = '#bbb'
const backgroundColor = '#fff'
export default {
  name: cname,
  components: {
    TextCon
  },
  mixins: [baseWidget],
  computed:{
    circleStyle() {
      let res = {borderRadius:'100%'}
      res.borderColor = this.borderColor || borderColor
      res.backgroundColor = this.backgroundColor || backgroundColor
      return {
        ...this.styleObj,
        ...res,
        borderStyle:this.borderStyle,
        borderWidth:`${this.borderWidth}px`,
      }
    },
  },
  data() {
    return {}
  },
  created() {},
  methods: {}
}
</script>
<style lang="less" scoped>
.gt-circle {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0px;
}
</style>

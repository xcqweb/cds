<template>
  <div class="gt-text" :style="styleObj">
    {{ text || "输入文本" }}
  </div>
</template>
<script>
import baseWidget from "@/mixins/base-widget"
const cname = "GtText"
export default {
  name: cname,
  mixins: [baseWidget],
  data() {
    return {}
  },
  created() {},
  methods: {
    dblclick() {
      console.log("a--------")
    }
  }
}
</script>
<style lang="less" scoped>
.gt-text {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background: #fff;
}
</style>

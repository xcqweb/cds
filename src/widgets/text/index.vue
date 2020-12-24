<template>
  <div class="gt-text" :style="styleObj">
    输入文本
  </div>
</template>
<script>
import baseComponent from "@/mixins/base"
export default {
  name: "GtText",
  mixins: [baseComponent],
  data() {
    return {
      styleObj: {
        width: "60px",
        height: "30px"
      }
    }
  },
  created() {}
}
</script>
<style lang="less" scoped>
.gt-text {
  display: flex;
  justify-content: center;
  align-items: center;
  border: solid 1px red;
}
</style>

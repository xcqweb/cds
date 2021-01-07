<template>
  <div class="gt-text" :style="styleObj" @dblclick.capture="dblclick">
    {{ text || "输入文本" }}
  </div>
</template>
<script>
import baseComponent from "@/mixins/base-editor"
const cname = "GtText"
export default {
  name: cname,
  mixins: [baseComponent],
  data() {
    return {}
  },
  created() {},
  methods: {
    dblclick(){
      console.log("a--------")
    }
  },
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

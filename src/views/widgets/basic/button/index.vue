<template>
  <div class="gt-button" :style="styleObj" @dblclick.capture="dblclick">
    {{ text || "按钮" }}
  </div>
</template>
<script>
import baseWidget from "@/mixins/base-widget"
const cname = "GtButton"
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
.gt-button {
  border-color: rgb(187, 187, 187);
  border-width: 1px;
  border-style: solid;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
}
</style>

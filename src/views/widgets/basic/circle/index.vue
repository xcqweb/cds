<template>
  <div class="gt-circle" :style="styleObj" @dblclick.capture="dblclick">
    {{ text }}
  </div>
</template>
<script>
import baseWidget from "@/mixins/base-widget"
const cname = "GtCircle"
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
.gt-circle {
  display: flex;
  justify-content: center;
  align-items: center;
  border-color: rgb(187, 187, 187);
  border-width: 1px;
  border-style: solid;
  padding: 0px;
  border-radius: 100%;
  background: #fff;
}
</style>

<template>
  <div class="gt-link" :style="styleObj" @dblclick.capture="dblclick">
    <a>Link</a>
  </div>
</template>
<script>
import baseWidget from "@/mixins/base-widget"
const cname = "GtLink"
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
.gt-link {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0px;
  background: #fff;
  a {
    color: #3d91f7;
    text-decoration: underline;
  }
}
</style>

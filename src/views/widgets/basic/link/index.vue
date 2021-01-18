<template>
  <div class="gt-link" :style="styleLink">
    <span v-if="!linkUrl" class="eg-text">
      Web Page
    </span>
    <iframe v-else :src="linkUrl" class="iframe-cls" frameborder="0" />
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
  computed: {
    styleLink() {
      return { ...this.styleObj, backgroundColor: "#ebebeb" }
    }
  },
  created() {},
  methods: {}
}
</script>
<style lang="less" scoped>
.gt-link {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0px;
  .eg-text {
    font-size: 16px;
    color: #8d9ea7;
  }
  .iframe-cls {
    border: none;
    outline: none;
    width: 100%;
    height: 100%;
  }
}
</style>

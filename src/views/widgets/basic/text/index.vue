<template>
  <div class="gt-text" :style="textStyle">
    <text-con v-bind="$props" />
  </div>
</template>
<script>
import baseWidget from "@/mixins/base-widget"
import TextCon from "../../components/text-con"
const cname = "GtText"
export default {
  name: cname,
  components: {
    TextCon
  },
  mixins: [baseWidget],
  computed: {
    textStyle() {
      return {
        ...this.styleObj,
        // borderStyle: this.borderStyle,
        // borderWidth: this.borderWidth,
        // borderColor: this.borderColor
      }
    }
  },
  data() {
    return {}
  },
  created() {
    if (!this.text && !this.isPreview) {
      this.$store.commit("updateWidget", { text: "输入文本", cid: this.cid })
    }
  },
  methods: {}
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

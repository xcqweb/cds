<template>
  <div class="gt-button" :style="buttonStyle">
    <text-con v-bind="$props" />
  </div>
</template>
<script>
import baseWidget from "@/mixins/base-widget"
import TextCon from "../../components/text-con"
const cname = "GtButton"
const borderColor = "#bbb"
const backgroundColor = "#fff"
export default {
  name: cname,
  components: {
    TextCon
  },
  mixins: [baseWidget],
  computed: {
    buttonStyle() {
      let res = { borderRadius: "4px" }
      res.borderColor = this.borderColor || borderColor
      res.backgroundColor = this.backgroundColor || backgroundColor
      return {
        ...this.styleObj,
        ...res,
        borderStyle: this.borderStyle,
        borderWidth: `${this.borderWidth}px`
      }
    }
  },
  data() {
    return {}
  },
  created() {
    if (!this.text && !this.isPreview) {
      this.$store.commit("updateWidget", { text: "按钮", cid: this.cid })
    }
  },
  methods: {}
}
</script>
<style lang="less" scoped>
.gt-button {
  display: flex;
}
</style>

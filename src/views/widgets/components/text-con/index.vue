<template>
  <div class="text-con" :style="objStyle">
    {{ text }}
  </div>
</template>

<script>
import baseWidget from "@/mixins/base-widget"
export default {
  name: "TextCon",
  mixins: [baseWidget],
  props: {
    text: String,
    cid: String
  },
  computed: {
    textEditorShow() {
      const obj = this.$store.state.textEditorShow
      return obj.show && this.cid == obj.cid
    },
    objStyle() {
      return {
        width: `${this.width}px`,
        height: `${this.height}px`,
        color: this.color,
        justifyContent: this.justifyContent,
        alignItems: this.alignItems,
        fontFamily: this.fontFamily,
        fontSize: `${this.fontSize}px`,
        fontWeight: this.fontWeight ? "bolder" : "normal",
        visibility: `${this.textEditorShow ? "hidden" : "visible"}`
      }
    }
  }
}
</script>
<style type="less" scoped>
.text-con {
  pointer-events: none;
  white-space: pre-wrap;
  display: flex;
  position: absolute;
  left: 0;
  top: 0;
}
</style>

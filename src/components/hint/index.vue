<template>
  <div class="hint-con" :style="objStyle" v-show="hint.show">
    {{ hint.text }}
  </div>
</template>
<script>
import { dealRotatePos } from "@u/deal"
export default {
  name: "Hint",
  computed: {
    hint() {
      return this.$store.state.hint
    },
    objStyle() {
      let left = 0
      let top = 0
      let width = 0
      const currentWidget = this.$store.getters.currentWidget
      if (currentWidget) {
        left = currentWidget.attrs.left
        width = currentWidget.attrs.width
        top = dealRotatePos(currentWidget.attrs).bottom + 10
      }
      if (this.$el) {
        const { width: elWidth } = this.$el.getBoundingClientRect()
        left = left + width / 2 - elWidth / 2
      }
      return {
        left: `${left}px`,
        top: `${top}px`
      }
    }
  },
  data() {
    return {}
  },
  created() {}
}
</script>
<style lang="less" scoped>
.hint-con {
  position: absolute;
  white-space: nowrap;
  background-color: #fff;
  border: 1px solid grey;
  padding: 4px 16px;
  border-radius: 3px;
  box-shadow: 1px 1px 2px 0 #ddd;
  opacity: 0.8;
  filter: alpha(opacity=80);
  font-size: 12px;
  z-index: 999;
}
</style>

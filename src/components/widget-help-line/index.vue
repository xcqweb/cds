<template>
  <div class="help-line-con" v-show="showHelpLine">
    <div :style="line1" class="line" />
    <div :style="line2" class="line" />
    <div :style="line3" class="line" />
    <div :style="line4" class="line" />
  </div>
</template>
<script>
const borderStyle = "dashed 1px #298df8"
const lineWidth = 3000
const lineLeft = -1000
export default {
  name: "WidgetHelpLine",
  computed: {
    showHelpLine() {
      return this.$store.state.showHelpLine
    },
    line1() {
      const currentWidget = this.$store.getters.currentWidget
      let top = 0
      if (currentWidget) {
        const { top: widgetTop } = currentWidget.attrs
        top = widgetTop
      }
      return {
        borderTop: borderStyle,
        width: `${lineWidth}px`,
        height: `0`,
        left: `${lineLeft}px`,
        top: `${top}px`
      }
    },
    line2() {
      const currentWidget = this.$store.getters.currentWidget
      let left = 0
      const tempObj = this.line4
      if (currentWidget) {
        const { width } = currentWidget.attrs
        left = parseInt(tempObj.left) + width
      }
      return {
        ...tempObj,
        left: `${left}px`
      }
    },
    line3() {
      const currentWidget = this.$store.getters.currentWidget
      let top = 0
      const tempObj = this.line1
      if (currentWidget) {
        const { height } = currentWidget.attrs
        top = parseInt(tempObj.top) + height
      }
      return {
        ...tempObj,
        top: `${top}px`
      }
    },
    line4() {
      const currentWidget = this.$store.getters.currentWidget
      let left = 0
      if (currentWidget) {
        const { left: widgetLeft } = currentWidget.attrs
        left = widgetLeft
      }
      return {
        borderLeft: borderStyle,
        width: `0`,
        height: `${lineWidth}px`,
        left: `${left}px`,
        top: `${lineLeft}px`
      }
    },
    selectWidgetsCount() {
      return this.$store.getters.selectWidgets.length
    }
  },
  watch: {
    selectWidgetsCount(val) {
      if (val > 1) {
        this.$store.commit("setShowHelpLine", false)
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
.help-line-con {
  z-index: 9999;
  pointer-events: none;
  height: 100%;
  width: 100%;
  .line {
    position: absolute;
  }
}
</style>

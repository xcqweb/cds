<template>
  <div class="help-line-con" v-show="show">
    <div :style="line1" class="line" />
    <div :style="line2" class="line" />
    <div :style="line3" class="line" />
    <div :style="line4" class="line" />
  </div>
</template>
<script>
const borderStyle = "dashed 1px #298df8"
export default {
  name: "WidgetHelpLine",
  props:{
    show:{
      default: false,
      type: Boolean
    }
  },
  computed: {
    line1() {
      const currentWidget = this.$store.getters.currentWidget
      let top = 0
      let left = 0
      if (currentWidget) {
        const { left: widgetLeft, top: widgetTop } = currentWidget.attrs
        left = widgetLeft
        top = widgetTop
      }
      return {
        border: borderStyle,
        width: `${left}px`,
        height: `${top}px`,
        left: 0,
        top: 0,
        borderTop: "none",
        borderLeft: "none"
      }
    },
    line2() {
      const currentWidget = this.$store.getters.currentWidget
      let top = 0
      let left = 0
      let width = 0
      if (currentWidget) {
        const {
          left: widgetLeft,
          top: widgetTop,
          width: widgetWidth
        } = currentWidget.attrs
        left = widgetLeft
        top = widgetTop
        width = widgetWidth
      }
      return {
        border: borderStyle,
        left: `${left + width}px`,
        top: 0,
        width: `calc(100% - ${left}px - ${width}px`,
        height: `${top}px`,
        borderTop: "none",
        borderRight: "none"
      }
    },
    line3() {
      const currentWidget = this.$store.getters.currentWidget
      let top = 0
      let left = 0
      let height = 0
      if (currentWidget) {
        const {
          left: widgetLeft,
          top: widgetTop,
          height: widgetHeight
        } = currentWidget.attrs
        left = widgetLeft
        top = widgetTop
        height = widgetHeight
      }
      return {
        border: borderStyle,
        left: 0,
        top: `${top + height}px`,
        width: `${left}px`,
        height: `calc(100% - ${top}px - ${height}px)`,
        borderBottom: "none",
        borderLeft: "none"
      }
    },
    line4() {
      const currentWidget = this.$store.getters.currentWidget
      let top = 0
      let left = 0
      let width = 0
      let height = 0
      if (currentWidget) {
        const {
          left: widgetLeft,
          top: widgetTop,
          width: widgetWidth,
          height: widgetHeight
        } = currentWidget.attrs
        left = widgetLeft
        top = widgetTop
        width = widgetWidth
        height = widgetHeight
      }
      return {
        border: borderStyle,
        left: ` ${left + width}px`,
        top: `${top + height}px`,
        width: `calc(100% - ${left}px - ${width}px`,
        height: `calc(100% - ${top}px - ${height}px)`,
        borderRight: "none",
        borderBottom: "none"
      }
    },
  },
  data() {
    return {
       
    }
  },
  created() {}
}
</script>
<style lang="less" scoped>
.help-line-con {
  z-index: 999;
  position: relative;
  pointer-events: none;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  .line {
    position: absolute;
  }
}
</style>

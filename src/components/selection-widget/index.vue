<template>
  <div class="selection-con" :style="objStyle" />
</template>
<script>
export default {
  name: "SelectionWidget",
  computed: {
    objStyle() {
      let { left, top, display, width, height } = this.$store.state.selection
      return {
        left: `${left}px`,
        top: `${top}px`,
        width: `${width}px`,
        height: `${height}px`,
        display: `${display || "none"}`
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
.selection-con {
  z-index: 1;
  position: absolute;
  pointer-events: none;
  background: rgba(38, 168, 255, 0.1);
  border: 1px solid rgb(30, 152, 234);
}
</style>

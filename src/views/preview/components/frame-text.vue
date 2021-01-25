<template>
  <ul class="frame-text-con" :objStyle="objStyle">
    <li v-for="(item, index) in frameTexts" :key="index">
      {{ item.paramMark }} = {{ item.paramValue }}
    </li>
  </ul>
</template>
<script>
export default {
  name: "FrameText",
  computed: {
    frameContent() {
      return this.$store.state.preview.frameContent
    },
    frameTexts() {
      return this.frameContent.texts
    },
    objStyle() {
      const { x, y } = this.frameContent.pos
      return {
        left: `${x}px`,
        top: `${y}px`
      }
    }
  }
}
</script>
<style lang="less" scoped>
.frame-text-con {
  position: absolute;
  padding: 6px;
  z-index: 9999999;
  min-width: 120px;
  min-height: 60px;
  max-height: 400px;
  opacity: 0.86;
  background: #fff;
  overflow-y: auto;
  border-radius: 4px;
  transition: all 0.4s;
}
</style>

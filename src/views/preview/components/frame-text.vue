<template>
  <ul class="frame-text-con" :style="objStyle">
    <li v-for="(item, index) in frameTexts" :key="index">
      {{ item.paramMark }} = {{ item.paramValue }}
      <br />
      time = {{ dealTime(item.ts) }}
    </li>
  </ul>
</template>
<script>
import { dealTimeFun } from "@u/deal"
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
  },
  methods: {
    dealTime(ts) {
      return dealTimeFun(ts,true)
    }
  }
}
</script>
<style lang="less" scoped>
ul,li{
  list-style: none;
}
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
  border: solid 1px #5d79e6;
  pointer-events: none;
  display: flex;
  align-items: center;
  flex-direction: column;
}
</style>

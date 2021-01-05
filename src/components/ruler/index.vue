<template>
  <div class="ruler-con">
    <SketchRule
      :lang="lang"
      :thick="thick"
      :scale="scale"
      :width="ruleSize.width"
      :height="ruleSize.height"
      :startX="startPos.x"
      :startY="startPos.y"
      :shadow="shadow"
      :horLineArr="lines.h"
      :verLineArr="lines.v"
      :cornerActive="cornerActive"
      @handleLine="handleLine"
      @onCornerClick="handleCornerClick"
      @hook:mounted="rulerMounted"
    />
  </div>
</template>

<script>
import SketchRule from "../sketch-ruler"
export default {
  name: "Ruler",
  components: { SketchRule },
  computed: {
    lines: {
      get() {
        return this.$store.getters.currentPage.lines
      },
      set(val) {
        this.$store.commit("setRuler", { lines: val })
      }
    },
    scale() {
      return this.$store.state.apply.scale
    },
    cornerActive() {
      return this.$store.state.ruler.cornerActive
    },
    startPos() {
      return this.$store.state.ruler.startPos
    },
    ruleSize() {
      const { width, height } = this.$store.state.ruler
      return {
        width,
        height
      }
    },
    shadow() {
      return this.$store.state.ruler.shadow
    },
    canvasStyle() {
      const { width, height } = this.$store.getters.currentPage
      return {
        width: width + "px",
        height: height + "px",
        transform: `scale(${this.scale})`
      }
    }
  },
  data() {
    return {
      thick: 20,
      lang: "zh-CN" // 中英文,
    }
  },
  created() {
    this.$bus.$emit("handleCornerClick")
  },
  beforeDestroy() {
    this.$bus.$off()
  },
  methods: {
    handleLine(lines) {
      this.lines = lines
    },
    handleCornerClick() {
      this.$bus.$emit("handleCornerClick")
    },
    rulerMounted() {
      const el = document.querySelector(".corner")
      if (el) {
        el.setAttribute("title", "点我回到原点")
      }
    }
  }
}
</script>
<style lang="less">
.ruler-con {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 3;
  overflow: hidden;
  .mb-ruler {
    .corner {
      &.active {
        background-color: rgba(235, 86, 72, 0.6) !important;
      }
    }
  }
}
</style>

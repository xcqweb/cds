<template>
  <div class="widget-outter-con" v-if="show">
    <div class="item-con fs">
      <label>填充颜色</label>
      <div
        class="fill-bg"
        :style="{ background }"
        @click="showColorPicker('fillColor', $event)"
      />
    </div>
  </div>
</template>
<script>
const transparentImg = `url(${require("@/assets/images/transparent.png")})`
import helpComputed from "@/mixins/help-computed"
export default {
  name: "WidgetOutter",
  mixins: [helpComputed],
  computed: {
    show() {
      const widgetNames = ["GtImage", "GtLink", "GtLine"]
      return !widgetNames.includes(this.cname)
    },
    background() {
      let color = this.attrs.backgroundColor
      if(color === '#00000000' || color === 'transparent') {
        color = transparentImg
      }
      return color
    }
  },
  data() {
    return {}
  },
  methods: {
    showColorPicker(type, evt) {
      this.$emit("showColorPicker", type, evt)
    }
  }
}
</script>
<style lang="less" scoped>
.widget-outter-con {
  // 控件外观
  .fill-bg {
    width: 60%;
    height: 30px;
    border: solid 1px #bbbbbb;
    cursor: pointer;
  }
}
</style>

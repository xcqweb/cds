<template>
  <div class="widget-outter-con" v-if="show">
    <div class="item-con fs">
      <label>填充颜色</label>
      <div
        class="fill-bg"
        :style="{ backgroundColor: attrs.backgroundColor }"
        @click="showColorPicker('fillColor', $event)"
      />
    </div>
  </div>
</template>
<script>
import helpComputed from "@/mixins/help-computed"
export default {
  name: "WidgetOutter",
  mixins: [helpComputed],
  computed: {
    show() {
      const widgetNames = ["GtImage", "GtLink", "GtLine"]
      return !widgetNames.includes(this.cname)
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

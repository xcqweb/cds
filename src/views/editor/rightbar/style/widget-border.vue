<template>
  <div class="widget-border-con" v-if="show">
    <div class="item-con">
      <label class="label-block">边框样式</label>
      <div class="fs">
        <div
          class="border-bg"
          :style="{ background: borderColor }"
          @click="showColorPicker('borderColor', $event)"
        />
        <a-select v-model="attrs.borderStyle" size="small" style="width:36%;">
          <a-select-option
            v-for="(item, index) in borderList"
            :key="index"
            :value="item"
          >
            <div
              :style="{ borderStyle: item }"
              class="right-con-widget-border-item"
            />
          </a-select-option>
        </a-select>
        <a-input
          size="small"
          v-model.number="attrs.borderWidth"
          :min="0"
          type="number"
          style="width:28%;"
        />
      </div>
    </div>
  </div>
</template>
<script>
const transparentImg = `url(${require("@/assets/images/transparent.png")})`
import helpComputed from "@/mixins/help-computed"
export default {
  name: "WidgetBorder",
  mixins: [helpComputed],
  computed: {
    show() {
      const widgetNames = ["GtLink",'GtText']
      return !widgetNames.includes(this.cname)
    },
    borderColor() {
      let color = this.attrs.borderColor
      if (color === "#00000000" || color === "transparent") {
        color = transparentImg
      }
      return color
    }
  },
  data() {
    return {
      borderList: ["solid", "dashed", "dotted"]
    }
  },
  methods: {
    showColorPicker(type, evt) {
      this.$emit("showColorPicker", type, evt)
    }
  }
}
</script>
<style lang="less" scoped>
.widget-border-con {
  .border-bg {
    width: 30%;
    height: 30px;
    border: solid 1px #bbbbbb;
    cursor: pointer;
  }
  /deep/.ant-select-selection__rendered {
    display: flex;
    align-items: center;
  }
}
</style>
<style>
.right-con-widget-border-item {
  width: 60px;
  height: 0;
  border: solid 1px #040c2c;
  line-height: normal;
}
</style>

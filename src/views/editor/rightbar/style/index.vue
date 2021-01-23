<template>
  <div class="widget-style-con">
    <widget-position />
    <widget-name />
    <text-style @showColorPicker="showColorPicker" />
    <widget-outter @showColorPicker="showColorPicker" />
    <widget-border @showColorPicker="showColorPicker" />
    <picture-style />
    <line-style />
    <link-style />
    <color-picker
      :visible.sync="visibleColor"
      :objStyle="objStyle"
      @colorChange="colorChange"
    />
  </div>
</template>

<script>
import WidgetPosition from "./widget-position"
import WidgetName from "./widget-name"
import TextStyle from "./text-style"
import WidgetOutter from "./widget-outter"
import WidgetBorder from "./widget-border"
import PictureStyle from "./picture-style"
import LineStyle from "./line-style"
import LinkStyle from "./link-style"
import ColorPicker from "@c/color-picker/index"
import helpComputed from "@/mixins/help-computed"
export default {
  name: "WidgetStyle",
  mixins: [helpComputed],
  components: {
    WidgetPosition,
    WidgetName,
    TextStyle,
    WidgetOutter,
    ColorPicker,
    WidgetBorder,
    PictureStyle,
    LineStyle,
    LinkStyle
  },
  data() {
    return {
      visibleColor: false,
      objStyle: {}
    }
  },
  methods: {
    colorChange(val) {
      let res = {}
      switch (this.colorType) {
        case "fontColor":
          res = { color: val, cid: this.textEditor.cid }
          break
        case "fillColor":
          res = { backgroundColor: val }
          break
        case "borderColor":
          res = { borderColor: val }
          break
      }
      this.selectWidgets.forEach(item => {
        this.$store.commit("updateWidgetAttrs", { ...res, cid: item.cid })
      })
    },
    showColorPicker(type, evt) {
      this.colorType = type
      const { srcElement } = evt
      const { top } = srcElement.getBoundingClientRect()
      this.objStyle = {
        left: "calc(-100% + 9px)",
        top: `${top - 250}px`
      }
      this.visibleColor = true
    }
  }
}
</script>

<style lang="less" scoped>
.widget-style-con {
  position: relative;
  width: 100%;
}
</style>

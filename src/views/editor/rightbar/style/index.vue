<template>
  <div>
    <name-position></name-position>
    <text-content></text-content>
    <text-info :textStyle="textStyle"></text-info>
    <text-color :textColor="textColor"></text-color>
  </div>
</template>

<script>
import namePosition from "./name-position"
import textColor from "./text-color"
import textInfo from "./text-info"
import textContent from "./text-content"
export default {
  name: "WidgetStyle",
  components: {
    namePosition,
    textColor,
    textInfo,
    textContent
  },
  data() {
    return {
      textStyle: {
        fontSize: [12, 14, 16, 18, 20, 22, 24, 28],
        color: "#000",
        bold: "bold",
        top: "top",
        bottom: "bottom",
        middle: "middle",
        left: "left",
        right: "right",
        center: "center",
        fontFamilyList: [
          { label: "黑体", value: "SimHei" },
          { label: "宋体 ", value: "SimSun" },
          { label: "微软雅黑", value: "Microsoft YaHei" },
          { label: "楷体", value: "KaiTi" },
          { label: "仿宋", value: "FangSong" }
        ]
      },
      textColor: {
        svgArr: ["1", "2", "3"],
        borderWidth: [1, 2, 3, 4, 5, 6, 7, 8]
      }
    }
  }
}
</script>

<style scoped></style>

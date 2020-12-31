<template>
  <div>
    <name-position :pos="pos"></name-position>
    <text-info :textStyle="textStyle"></text-info>
    <text-color :textColor="textColor"></text-color>
  </div>
</template>

<script>
import namePosition from "./name-position"
import textColor from "./text-color"
import textInfo from "./text-info"
export default {
  name: "index",
  components: {
    namePosition,
    textColor,
    textInfo
  },
  data() {
    return {
      pos: {
        name: "",
        x: 100,
        y: 100,
        w: 100,
        h: 100
      },
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

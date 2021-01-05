<template>
  <div>
    <!--基本操作-->
    <div>调整位置</div>
    <div>
      <button @click="changePosition('left')">left</button>
      <button @click="changePosition('center')">center</button>
      <button @click="changePosition('right')">right</button>
    </div>
    <div>
      <button @click="changePosition('top')">top</button>
      <button @click="changePosition('middle')">middle</button>
      <button @click="changePosition('bottom')">bottom</button>
    </div>
  </div>
</template>

<script>
import helpMethods from "@/mixins/help-methods"
import helpComputed from "@/mixins/help-computed"
export default {
  name: "AdjustPotion",
  mixins: [helpMethods, helpComputed],
  data() {
    return {}
  },
  methods: {
    changePosition(flag) {
      if (!this.currentWidget) {
        // 未选中任何控件
        return
      }
      const selectWidgetsCount = this.selectWidgets.length
      const attrs = this.calculateSelectWidgets(this.selectWidgets)
      let left = 0,
        top = 0
      switch (flag) {
        case "left":
          if (selectWidgetsCount > 1) {
            left = attrs.left
          }
          this.$store.commit("updateWidgetAttrsPatch", { left })
          break
        case "right":
          if (selectWidgetsCount > 1) {
            left = attrs.right
            this.selectWidgets.forEach(item => {
              this.$store.commit("updateWidgetAttrs", {
                left: left - item.attrs.width,
                cid: item.cid
              })
            })
          } else {
            left = this.currentPage.width - this.currentWidget.attrs.width
            this.$store.commit("updateWidgetAttrs", { left })
          }
          break
        case "top":
          if (selectWidgetsCount > 1) {
            top = attrs.top
          }
          this.$store.commit("updateWidgetAttrsPatch", { top })
          break
        case "bottom":
          if (selectWidgetsCount > 1) {
            top = attrs.bottom
            this.selectWidgets.forEach(item => {
              this.$store.commit("updateWidgetAttrs", {
                top: top - item.attrs.height,
                cid: item.cid
              })
            })
          } else {
            top = this.currentPage.height - this.currentWidget.attrs.height
            this.$store.commit("updateWidgetAttrs", { top })
          }
          break
        case "center":
          if (selectWidgetsCount > 1) {
            this.selectWidgets.forEach(item => {
              if (item.attrs.left < attrs.centerX) {
                left =
                  item.attrs.left + (attrs.width / 2 - item.attrs.width / 2)
              } else {
                left =
                  item.attrs.left - (attrs.width / 2 - item.attrs.width / 2)
              }
              console.log(left, "a------")
              this.$store.commit("updateWidgetAttrs", { left, cid: item.cid })
            })
          } else {
            left =
              (this.currentPage.height - this.currentWidget.attrs.height) / 2
            this.$store.commit("updateWidgetAttrs", { left })
          }
          break
        case "middle":
          if (selectWidgetsCount > 1) {
            this.selectWidgets.forEach(item => {
              if (item.attrs.top < attrs.centerY) {
                top =
                  item.attrs.top + (attrs.height / 2 - item.attrs.height / 2)
              } else {
                top =
                  item.attrs.top - (attrs.height / 2 - item.attrs.height / 2)
              }
              this.$store.commit("updateWidgetAttrs", { top, cid: item.cid })
            })
          } else {
            top =
              (this.currentPage.height - this.currentWidget.attrs.height) / 2
            this.$store.commit("updateWidgetAttrs", { top })
          }
          break
      }
    }
  }
}
</script>

<style scoped></style>

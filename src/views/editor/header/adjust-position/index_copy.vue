<template>
  <!--基本操作-->
  <a-menu slot="overlay">
    <a-menu-item>
      <button @click="changePosition('left')">left</button>
    </a-menu-item>
    <a-menu-item>
      <button @click="changePosition('center')">center</button>
    </a-menu-item>
    <a-menu-item>
      <button @click="changePosition('right')">right</button>
    </a-menu-item>
    <a-menu-item>
      <button @click="changePosition('top')">top</button>
    </a-menu-item>
    <a-menu-item>
      <button @click="changePosition('middle')">middle</button>
    </a-menu-item>
    <a-menu-item>
      <button @click="changePosition('bottom')">bottom</button>
    </a-menu-item>
  </a-menu>
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
              left = attrs.centerX - item.attrs.width / 2
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
              top = attrs.centerY - item.attrs.height / 2
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

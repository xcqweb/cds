<template>
  <!--基本操作-->
  <a-menu slot="overlay">
    <a-menu-item>
      <svg-icon icon-class="left" class-name="side-nav-icon" />
      <span @click="changePosition('left')">左对齐</span>
    </a-menu-item>
    <a-menu-item>
      <svg-icon icon-class="right" class-name="side-nav-icon" />
      <span @click="changePosition('right')">右对齐</span>
    </a-menu-item>
    <a-menu-item>
      <svg-icon icon-class="tc" class-name="side-nav-icon" />
      <span @click="changePosition('top')">上对齐</span>
    </a-menu-item>
    <a-menu-item>
      <svg-icon icon-class="bc" class-name="side-nav-icon" />
      <span @click="changePosition('bottom')">下对齐</span>
    </a-menu-item>
    <a-menu-item>
      <svg-icon icon-class="center" class-name="side-nav-icon" />
      <span @click="changePosition('center')">水平居中对齐</span>
    </a-menu-item>
    <a-menu-item>
      <svg-icon icon-class="middle" class-name="side-nav-icon" />
      <span @click="changePosition('middle')">垂直居中对齐</span>
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

<style scoped>
.ant-menu-vertical > .ant-menu-item {
  height: 28px;
  line-height: 28px;
  width: 112px;
  padding: 0 6px;
}
.ant-menu-vertical > .ant-menu-item:active,
.ant-menu-vertical > .ant-menu-item:hover {
  background: #f0f1f3;
}
.ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected {
  background-color: #f0f1f3;
}
.ant-menu-vertical .ant-menu-item:not(:last-child) {
  margin-bottom: 0px;
}
.ant-menu-item {
  white-space: unset;
}
.side-nav-icon {
  width: 1em;
  height: 1em;
}
</style>

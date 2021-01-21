<template>
  <div class="preview-menu-con" :class="conCls">
    <menu-item-v v-if="position == 1" :pages="pages" />
    <menu-item-h v-if="position == 2" :pages="pages" />
  </div>
</template>
<script>
const posArr = ["left", "top"]
import MenuItemV from "./menu/menu-item-v"
import MenuItemH from "./menu/menu-item-h"
export default {
  name: "PreviewMenu",
  components: {
    MenuItemV,
    MenuItemH
  },
  computed: {
    apply() {
      return this.$store.state.preview.apply
    },
    pages() {
      return this.$store.state.preview.pages
    },
    position() {
      return this.apply.navPosition || 0
    },
    navStyle() {
      let res = { mode: "dark", theme: 1 }
      const navStyle = this.apply.navStyle
      if (navStyle) {
        res = JSON.parse(navStyle)
      }
      return res
    },
    conCls() {
      return `${posArr[this.position - 1]} theme${this.navStyle.theme} ${
        this.navStyle.mode
      }`
    }
  },
  data() {
    return {}
  },
  mounted() {}
}
</script>
<style lang="less">
.preview-menu-con {
  position: absolute;
  opacity: 0.98;
  left: 0;
  top: 0;
  &.dark {
    background: #001529;
    color: #fff;
    &.left {
      &.theme1 {
        .menu-item {
          &:hover,
          &.select {
            background: #1740dc;
          }
        }
      }
      &.theme2 {
        .menu-item {
          &:hover,
          &.select {
            background: #f5222d;
          }
        }
      }
      &.theme3 {
        .menu-item {
          &:hover,
          &.select {
            background: #f9531c;
          }
        }
      }
      &.theme4 {
        .menu-item {
          &:hover,
          &.select {
            background: #eb2f96;
          }
        }
      }
      &.theme5 {
        .menu-item {
          &:hover,
          &.select {
            background: #722ed1;
          }
        }
      }
      &.theme6 {
        .menu-item {
          &:hover,
          &.select {
            background: #13c2c2;
          }
        }
      }
    }
  }
  &.light {
    background: #fff;
    color: #040c2c;
    &.left {
      &.theme1 {
        .menu-item {
          &:hover,
          &.select {
            color: rgba(23, 64, 220, 1);
            background: rgba(23, 64, 220, 0.05);
          }
        }
      }
      &.theme2 {
        .menu-item {
          &:hover,
          &.select {
            color: rgba(245, 34, 45, 1);
            background: rgba(245, 34, 45, 0.05);
          }
        }
      }
      &.theme3 {
        .menu-item {
          &:hover,
          &.select {
            color: rgba(249, 83, 28, 1);
            background: rgba(249, 83, 28, 0.05);
          }
        }
      }
      &.theme4 {
        .menu-item {
          &:hover,
          &.select {
            color: rgba(114, 46, 209, 1);
            background: rgba(114, 46, 209, 0.05);
          }
        }
      }
      &.theme5 {
        .menu-item {
          &:hover,
          &.select {
            color: rgba(19, 194, 194, 1);
            background: rgba(19, 194, 194, 0.05);
          }
        }
      }
      &.theme6 {
        .menu-item {
          &:hover,
          &.select {
            color: rgba(235, 47, 150, 1);
            background: rgba(235, 47, 150, 0.05);
          }
        }
      }
    }
  }
  &.left {
    width: 200px;
    height: 100%;
  }
  &.top {
    height: 50px;
    width: 100%;
    align-items: center;
  }
}
</style>

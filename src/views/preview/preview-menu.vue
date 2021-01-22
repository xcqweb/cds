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
@light:#fff;
@dark: #001529;
@themeSet:{
  theme1:#1740dc;
  theme2:#f5222d;
  theme3:#f9531c;
  theme4:#eb2f96;
  theme5:#722ed1;
  theme6:#13c2c2;
}
.preview-menu-con {
  position: absolute;
  opacity: 0.98;
  left: 0;
  top: 0;
  font-size: 13px;
  &.dark {
    background: @dark;
    color: #fff;
    &.left {
      each(@themeSet,{
        &.@{key} {
          .menu-item {
            &:hover,
            &.select {
              background: @value;
            }
          }
        }
      })
    }
    &.top {
      each(@themeSet,{
        &.@{key} {
          .menu-item {
            &:hover,
            &.select {
              color: @value;
            }
            &.select {
              border-bottom: solid 2px @value;
            }
            &.select-child{
              color: @value;
            }
          }
          .submenu-item {
            &:hover,
            &.select {
              color: @value;
              background: fade(@value,5%);
            }
          }
        }
      })
      .submenu-con {
        background: @dark;
        box-shadow: 0px 2px 6px 0px rgba(4, 12, 44, 0.25);
        border: 1px solid #000310;
      }
    }
  }
  &.light {
    background: @light;
    color: #040c2c;
    &.left {
      each(@themeSet,{
        &.@{key} {
          .menu-item {
            &:hover,
            &.select {
              background: fade(@value,5%);
              color: @value;
            }
          }
        }
      })
    }
    &.top {
      each(@themeSet,{
        &.@{key} {
          .menu-item {
            &:hover,
            &.select {
              color: @value;
            }
            &.select {
              border-bottom: solid 2px @value;
            }
            &.select-child{
              color: @value;
            }
          }
          .submenu-item {
            &:hover,
            &.select {
              color: @value;
              background: fade(@value,5%);
            }
          }
        }
      })
      .submenu-con {
        background: @light;
        box-shadow: 0px 2px 6px 0px rgba(4, 12, 44, 0.25);
        border: 1px solid #e6e7ea;
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
    box-shadow: 0px 2px 7px 0px rgba(0, 9, 43, 0.09);
  }
}
</style>

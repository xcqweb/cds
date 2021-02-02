<template>
  <div class="preview-menu-con" :class="conCls" :style="objStyle">
    <menu-item-v v-if="position == 1" :pages="pages" />
    <menu-item-h v-if="position == 2" :pages="pages" :showMenu="showMenu"/>
    <div class="trigger-con" :class="triggerCls" @click.stop="operateMenu">
      <svg
        v-if="position==1"
        xmlns="http://www.w3.org/2000/svg"
        class="svg-icon"
        viewBox="0 0 16 86"
        width="16"
        height="86"
      >
        <g fill="none" fill-rule="evenodd">
          <path
            class="path-wapper"
            d="M0 0l14.12 8.825A4 4 0 0116 12.217v61.566a4 4 0 01-1.88 3.392L0 86V0z"
          />
          <path
            class="path-arrow"
            d="M10.758 48.766a.778.778 0 000-1.127L6.996 43l3.762-4.639a.778.778 0 000-1.127.85.85 0 00-1.172 0l-4.344 5.202a.78.78 0 000 1.128l4.344 5.202a.85.85 0 001.172 0z"
            fill-rule="nonzero"
          />
        </g>
      </svg>
      <svg 
       v-if="position==2"
        xmlns="http://www.w3.org/2000/svg"
        class="svg-icon"
        viewBox="0 0 86 16"
        width="86" 
        height="16"
      >
        <g fill-rule="evenodd">
          <path  
            class="path-wapper"
            d="M0.000,-0.000 L86.000,-0.000 L78.000,16.000 L8.000,16.000 L0.000,-0.000 Z"
          />
          <path 
            class="path-arrow"
            d="M36.544,10.407 L43.615,3.336 C44.006,2.946 44.639,2.946 45.029,3.336 L52.100,10.407 C52.491,10.798 52.491,11.431 52.100,11.821 C51.710,12.212 51.077,12.212 50.686,11.821 L44.322,5.457 L37.958,11.821 C37.568,12.212 36.935,12.212 36.544,11.821 C36.154,11.431 36.154,10.798 36.544,10.407 Z"
            fill-rule="nonzero"
          />
        </g>
      </svg>
    </div>
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
    },
    triggerCls() {
      return [
        `trigger-${posArr[this.position - 1]}`,
        { "is-minimized": !this.showMenu }
      ]
    }
  },
  data() {
    return {
      showMenu: true,
      objStyle: {}
    }
  },
  mounted() {},
  methods: {
    operateMenu() {
      const pos = posArr[this.position - 1]
      if (pos == "left") {
        if (this.showMenu) {
          this.objStyle.width = 0
        } else {
          this.objStyle.width = "200px"
        }
      } else {
        if (this.showMenu) {
          this.objStyle.height = 0
        } else {
          this.objStyle.height = "50px"
        }
      }
      this.showMenu = !this.showMenu
    }
  }
}
</script>
<style lang="less">
@lightDefaultFont:rgba(4, 12, 44, 0.85);
@darkDefualtFont:rgba(255, 255, 255, 0.7);
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
  z-index:200;
  transition: all 0.3s ease-in-out 0s;
  z-index: 100;
  &.dark {
    background: @dark;
    color:@darkDefualtFont;
    &.left {
      each(@themeSet,{
        &.@{key} {
          .menu-item {
            &:hover,
            &.select {
              background: @value;
              color:@light;
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
    .path-wapper {
      fill:@dark;
    }
    .path-arrow{
      fill:@light;
    }
  }
  &.light {
    background: @light;
    color: @lightDefaultFont;
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
    .path-wapper {
      fill:@light;
    }
    .path-arrow{
      fill:@dark;
    }
  }
  .trigger-con{
    position:absolute;
    display: flex;
    z-index: 1;
    cursor: pointer;
    opacity: 0;
    pointer-events: auto;
    transition: opacity 0.2s ease-in-out 0s;
    .svg-icon{
      font-size:16px;
    }
    &.is-minimized{
      opacity: 1;
      pointer-events: auto;
      .path-arrow {
        transform-origin: center center;
        transform: rotate(180deg);
      }
      &:hover:not(.is-minimized) {
        opacity: 1;
        pointer-events: auto;
      }
    }
    &.trigger-left{
      left:100%;
    }
    &.trigger-top{
      top:100%;
    }
  }
  &.left {
    width: 200px;
    height: 100%;
    .trigger-con{
      width: 16px;
      height: 172px;
      align-items: center;
      top: 50%;
      margin-top: -86px;
    }
  }
  &.top {
    height: 50px;
    width: 100%;
    box-shadow: 0px 2px 7px 0px rgba(0, 9, 43, 0.09);
    .trigger-con{
      width: 172px;
      height: 16px;
      left:50%;
      margin-left:-86px;
    }
  }
  &:hover{
    .trigger-con{
      opacity: 1;
      pointer-events: auto;
    }
  }
}
</style>

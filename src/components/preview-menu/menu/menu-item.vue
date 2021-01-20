<template>
  <a
    v-if="to"
    :href="linkUrl"
    :target="target"
    :class="classes"
    :style="itemStyle"
    @click.exact="handleClickItem($event, false)"
    @click.ctrl="handleClickItem($event, true)"
    @click.meta="handleClickItem($event, true)"
    ><slot
  /></a>
  <li v-else :class="classes" :style="itemStyle" @click.stop="handleClickItem">
    <slot />
  </li>
</template>
<script>
import Emitter from "./emitter"
import { findComponentUpward } from "./assist"
import mixin from "./mixin"
import mixinsLink from "./link"

const prefixCls = "ivu-menu"

export default {
  name: "MenuItem",
  mixins: [Emitter, mixin, mixinsLink],
  props: {
    name: {
      type: [String, Number],
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      active: false
    }
  },
  computed: {
    classes() {
      return [
        `${prefixCls}-item`,
        {
          [`${prefixCls}-item-active`]: this.active,
          [`${prefixCls}-item-selected`]: this.active,
          [`${prefixCls}-item-disabled`]: this.disabled
        }
      ]
    },
    itemStyle() {
      return this.hasParentSubmenu && this.mode !== "horizontal"
        ? {
            paddingLeft: 43 + (this.parentSubmenuNum - 1) * 24 + "px"
          }
        : {}
    }
  },
  mounted() {
    this.$on("on-update-active-name", name => {
      if (this.name === name) {
        this.active = true
        this.dispatch("Submenu", "on-update-active-name", name)
      }
    })
  },
  methods: {
    handleClickItem(event, newWindow = false) {
      if (this.disabled) {
        return
      }

      if (newWindow || this.target === "_blank") {
        // 如果是 newWindow，直接新开窗口就行，无需发送状态
        this.handleCheckClick(event, newWindow)
        let parentMenu = findComponentUpward(this, "Menu")
        if (parentMenu) {
          parentMenu.handleEmitSelectEvent(this.name)
        }
      } else {
        let parent = findComponentUpward(this, "Submenu")
        let root
        if (parent) {
          this.dispatch("Submenu", "on-menu-item-select", this.name)
          if (this.mode == "horizontal") {
            root = this.$parent.$parent.$parent
          } else {
            root = this.$parent.$parent
          }
        } else {
          root = this.$parent
        }
        this.dealElseCheck(root)
        this.active = true
        this.handleCheckClick(event, newWindow)
      }
      this.$emit("itemClick", this.name)
    },
    dealElseCheck(root) {
      root.$children.forEach(item => {
        if (item.$options.name == "MenuItem") {
          item.active = false
        } else if (item.$options.name == "Submenu") {
          item.subMenuSelect = false
          item.$children.forEach(m => {
            if (m.$options.name == "MenuItem") {
              m.active = false
            } else if (m.$options.name == "Drop") {
              // 导航水平时候
              m.$children.forEach(c => {
                if (c.$options.name == "MenuItem") {
                  c.active = false
                }
              })
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="less">
.ivu-menu-dark.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu),
.ivu-menu-dark.ivu-menu-vertical
  .ivu-menu-submenu-title-active:not(.ivu-menu-submenu) {
  color: #fff;
}
.ivu-menu-dark.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu),
.ivu-menu-dark.ivu-menu-vertical
  .ivu-menu-item-active:not(.ivu-menu-submenu):hover,
.ivu-menu-dark.ivu-menu-vertical
  .ivu-menu-submenu-title-active:not(.ivu-menu-submenu),
.ivu-menu-dark.ivu-menu-vertical
  .ivu-menu-submenu-title-active:not(.ivu-menu-submenu):hover {
  background: #2d8cf0;
}
</style>

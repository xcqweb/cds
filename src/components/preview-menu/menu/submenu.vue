<template>
  <li
    :class="classes"
    @mouseleave="handleMouseleave"
    @mouseenter="handleMouseenter"
  >
    <div
      ref="reference"
      :class="[prefixCls + '-submenu-title']"
      :style="titleStyle"
      @click.stop="handleClick"
    >
      <slot name="title" />
      <Icon
        :type="arrowType"
        :custom="customArrowType"
        :size="arrowSize"
        :class="[prefixCls + '-submenu-title-icon']"
        @click.stop="showSubMenu"
      />
    </div>
    <collapse-transition v-if="mode === 'vertical'">
      <ul v-show="opened" :class="[prefixCls]">
        <slot />
      </ul>
    </collapse-transition>
    <transition v-else name="slide-up">
      <Drop v-show="opened" ref="drop" placement="bottom" :style="dropStyle">
        <ul :class="[prefixCls + '-drop-list']">
          <slot />
        </ul>
      </Drop>
    </transition>
  </li>
</template>
<script>
import { Icon } from "iview"
import Drop from "./dropdown"
import CollapseTransition from "./collapse-transition"
import { getStyle, findComponentUpward, findComponentsDownward } from "./assist"
import Emitter from "./emitter"
import mixin from "./mixin"

const prefixCls = "ivu-menu"

export default {
  name: "Submenu",
  components: { Icon, Drop, CollapseTransition },
  mixins: [Emitter, mixin],
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
      prefixCls: prefixCls,
      active: false,
      opened: false,
      subMenuSelect: false,
      dropWidth: parseFloat(getStyle(this.$el, "width"))
    }
  },
  computed: {
    classes() {
      return [
        `${prefixCls}-submenu`,
        {
          [`${prefixCls}-item-active`]: this.active && !this.hasParentSubmenu,
          [`${prefixCls}-submenu-disabled`]: this.disabled,
          [`${prefixCls}-submenu-select`]: this.subMenuSelect,
          [`${prefixCls}-submenu-has-parent-submenu`]: this.hasParentSubmenu
        }
      ]
    },
    accordion() {
      return this.menu.accordion
    },
    dropStyle() {
      let style = {}

      if (this.dropWidth) {
        style.minWidth = `${this.dropWidth}px`
      }
      return style
    },
    titleStyle() {
      return this.hasParentSubmenu && this.mode !== "horizontal"
        ? {
            paddingLeft: 43 + (this.parentSubmenuNum - 1) * 24 + "px"
          }
        : {}
    },
    // 3.4.0, global setting customArrow 有值时，arrow 赋值空
    arrowType() {
      let type = "ios-arrow-down"

      if (this.$IVIEW) {
        if (this.$IVIEW.menu.customArrow) {
          type = ""
        } else if (this.$IVIEW.menu.arrow) {
          type = this.$IVIEW.menu.arrow
        }
      }
      return type
    },
    // 3.4.0, global setting
    customArrowType() {
      let type = ""

      if (this.$IVIEW) {
        if (this.$IVIEW.menu.customArrow) {
          type = this.$IVIEW.menu.customArrow
        }
      }
      return type
    },
    // 3.4.0, global setting
    arrowSize() {
      let size = ""

      if (this.$IVIEW) {
        if (this.$IVIEW.menu.arrowSize) {
          size = this.$IVIEW.menu.arrowSize
        }
      }
      return size
    }
  },
  watch: {
    mode(val) {
      if (val === "horizontal") {
        this.$refs.drop.update()
      }
    },
    opened(val) {
      if (this.mode === "vertical") {
        return
      }
      if (val) {
        // set drop a width to fixed when menu has fixed position
        this.dropWidth = parseFloat(getStyle(this.$el, "width"))
        this.$refs.drop.update()
      } else {
        this.$refs.drop.destroy()
      }
    }
  },
  mounted() {
    this.$on("on-menu-item-select", name => {
      if (this.mode === "horizontal") {
        this.opened = false
      }
      this.dispatch("Menu", "on-menu-item-select", name)
      return true
    })
    this.$on("on-update-active-name", status => {
      if (findComponentUpward(this, "Submenu")) {
        this.dispatch("Submenu", "on-update-active-name", status)
      }
      if (findComponentsDownward(this, "Submenu")) {
        findComponentsDownward(this, "Submenu").forEach(item => {
          item.active = false
        })
      }
      this.active = status
    })
  },
  methods: {
    handleMouseenter() {
      if (this.disabled) {
        return
      }
      if (this.mode === "vertical") {
        return
      }

      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        // this.menu.updateOpenKeys(this.name);
        this.opened = true
      }, 250)
    },
    handleMouseleave() {
      if (this.disabled) {
        return
      }
      if (this.mode === "vertical") {
        return
      }
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.opened = false
        // this.menu.updateOpenKeys(this.name);
      }, 150)
    },
    showSubMenu() {
      if (this.accordion) {
        this.$parent.$children.forEach(item => {
          if (item.$options.name === "Submenu") {
            item.opened = false
          }
        })
      }
      const opened = this.opened
      this.opened = !opened
      this.menu.updateOpenKeys(this.name)
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
    },
    handleClick() {
      if (this.disabled) {
        return
      }
      this.dealElseCheck(this.$parent)
      this.subMenuSelect = true
      this.$emit("subMenuClick", this.name)
    }
  }
}
</script>
<style lang="less">
.ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu-select {
  .ivu-menu-submenu-title,
  .ivu-menu-submenu-title:hover {
    color: #fff;
    background: #2d8cf0;
  }
}
.ivu-menu-light.ivu-menu-vertical .ivu-menu-submenu-select {
  .ivu-menu-submenu-title,
  .ivu-menu-submenu-title:hover {
    color: #2d8cf0;
    background: #f0faff;
    &:after {
      content: "";
      display: block;
      width: 2px;
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      background: #2d8cf0;
    }
  }
}
.ivu-menu-dark.ivu-menu-horizontal .ivu-menu-submenu-select {
  .ivu-menu-submenu-title,
  .ivu-menu-submenu-title:hover {
    color: #fff !important;
  }
}
.ivu-menu-light.ivu-menu-horizontal .ivu-menu-submenu-select {
  .ivu-menu-submenu-title,
  .ivu-menu-submenu-title:hover {
    color: #2d8cf0;
    border-bottom: 2px solid #2d8cf0;
  }
}
</style>

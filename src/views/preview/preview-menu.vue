<template>
  <div
    class="preview-menu-con"
    :class="{
      'menu-collapse': isCollapsed,
      'menu-horizontal': mode == 'horizontal'
    }"
  >
    <Menu v-show="!isCollapsed" :theme="theme" :mode="mode" width="auto">
      <template v-for="item in pages">
        <MenuItem
          v-if="!item.children"
          :key="item.pageId"
          :name="item.pageId"
          :class="`menu_${item.pageId}`"
          @itemClick="itemSelect"
        >
          {{ item.pageName }}
        </MenuItem>
        <Submenu
          v-else
          :key="item.pageId"
          :name="item.pageId"
          :class="`menu_${item.pageId}`"
          @subMenuClick="itemSelect"
        >
          <template slot="title">
            {{ item.pageName }}
          </template>
          <MenuItem
            v-for="c in item.children"
            :key="c.pageId"
            :name="c.pageId"
            :class="`menu_${c.pageId}`"
            @itemClick="itemSelect"
          >
            {{ c.pageName }}
          </MenuItem>
        </Submenu>
      </template>
    </Menu>
  </div>
</template>

<script>
import "iview/dist/styles/iview.css"
import Menu from "@c/preview-menu/menu"
import Submenu from "@c/preview-menu/submenu"
import MenuItem from "@c/preview-menu/menu-item"
const modes = ["vertical", "horizontal"]
export default {
  name: "PreviewMenu",
  props: {
    pages: Array,
    apply: Object
  },
  computed: {
    mode() {
      return modes[this.apply.navPosition - 1]
    },
    navStyle() {
      return JSON.parse(this.apply.navStyle)
    },
    theme() {
      return this.navStyle.theme
    }
  },
  components: {
    Menu,
    Submenu,
    MenuItem
  },
  data() {
    return {
      isCollapsed: false
    }
  },
  watch: {
    mode(val) {}
  },
  created() {},
  methods: {
    initMenus() {},
    itemSelect(id) {}
  }
}
</script>
<style lang="less">
.preview-menu-con {
  position: absolute;
  top: 0;
  width: 200px;
  height: 100%;
  opacity: 0.98;
  &.menu-horizontal {
    height: 60px;
    width: 100%;
  }
  .ivu-menu-vertical {
    height: 100%;
  }
  .ivu-menu-horizontal {
    width: 100%;
  }
}
</style>

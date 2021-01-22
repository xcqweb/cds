<template>
  <ul class="menu-item-h">
    <li v-for="item in pages" :key="item.pageId">
      <div
        class="menu-item"
        :class="{
          select: currentPage.pageId == item.pageId,
          'select-child': item.isChildSelect
        }"
        @click="changePage(item)"
        @mouseover="expandParent(item)"
      >
        {{ item.pageName }}
      </div>
      <div
        class="submenu-con"
        v-if="item.children && item.expand"
        v-click-out-side="() => collapseParent(item)"
        @mouseleave="collapseParent(item)"
      >
        <div
          class="submenu-item"
          v-for="p in item.children"
          :key="p.pageId"
          @click="changeChildPage(p, item)"
          :class="{ select: currentPage.pageId == p.pageId }"
        >
          {{ p.pageName }}
        </div>
      </div>
    </li>
  </ul>
</template>
<script>
export default {
  name: "MenuItemH",
  props: {
    pages: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    currentPage() {
      return this.$store.state.preview.currentPage
    }
  },
  mounted() {},
  methods: {
    expandParent(page) {
      this.$set(page, "expand", true)
    },
    collapseParent(page) {
      this.$set(page, "expand", false)
    },
    changePage(page) {
      this.$store.commit("preview/setCurrentPage", page)
      this.pages.forEach(p => {
        this.$set(p, "isChildSelect", false)
      })
    },
    changeChildPage(page, item) {
      this.pages.forEach(p => {
        if (p.pageId == item.pageId) {
          this.$set(p, "isChildSelect", true)
        } else {
          this.$set(p, "isChildSelect", false)
        }
      })
      this.collapseParent(item)
      this.$store.commit("preview/setCurrentPage", page)
    }
  }
}
</script>
<style lang="less" scoped>
.menu-item-h {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  position: relative;
  padding: 0 20px;
  justify-content: center;
  ul,
  li {
    list-style: none;
  }
  .menu-item {
    display: flex;
    height: 50px;
    align-items: center;
    justify-content: center;
    min-width: 80px;
    position: relative;
    cursor: pointer;
  }
  .submenu-con {
    position: absolute;
    top: 48px;
    padding: 10px 0;
    border-radius: 2px;
    .submenu-item {
      display: flex;
      align-items: center;
      padding: 4px 10px;
      cursor: pointer;
    }
  }
}
</style>

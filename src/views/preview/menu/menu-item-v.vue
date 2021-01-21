<template>
  <ul class="menu-item-v">
    <li v-for="item in pages" :key="item.pageId">
      <div
        class="menu-item"
        :style="{ paddingLeft: `${item.level * 14}px` }"
        :class="{ select: currentPage.pageId == item.pageId }"
        @click="changePage(item)"
      >
        <div class="name-con">{{ item.pageName }}</div>
        <a
          class="expander"
          :class="{ 'is-expand': item.expand }"
          v-if="item.children"
          @click.stop.prevent="expand(item)"
        >
          <svg-icon icon-class="arrow-left" />
        </a>
      </div>
      <menu-item-v
        :pages="item.children"
        v-if="item.children && !item.expand"
      />
    </li>
  </ul>
</template>
<script>
export default {
  name: "MenuItemV",
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
    expand(page) {
      this.$set(page, "expand", !page.expand)
    },
    changePage(page) {
      this.$store.commit("preview/setCurrentPage", page)
    }
  }
}
</script>
<style lang="less">
.menu-item-v {
  .menu-item {
    height: 40px;
    padding: 0 10px;
    display: flex;
    align-items: center;
    overflow: hidden;
    cursor: pointer;
    .name-con {
      width: 100%;
    }
    .expander {
      display: flex;
      width: 12px;
      margin-right: 4px;
      color: currentColor;
      &.is-expand {
        transform: rotate(270deg);
      }
    }
  }
}
</style>

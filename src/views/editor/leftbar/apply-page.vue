<template>
  <div class="page-con">
    <div class="header">
      <span>页面</span>
      <a-icon type="plus" class="icon" @click="addPage" />
    </div>
    <div class="scroll-con">
      <page-menu :pages="pages" @clickAddFlag="clickAddFlag" />
    </div>
    <page-popmenu :show-del="showDel" />
  </div>
</template>
<script>
import PageMenu from "./components/page-menu.vue"
import arrayToTree from "array-to-tree"
import PagePopmenu from "./components/page-popmenu"
export default {
  name: "ApplyPage",
  components: {
    PageMenu,
    PagePopmenu
  },
  computed: {
    pages() {
      let pages = this.$store.state.apply.pages
      pages = arrayToTree(pages, { parentProperty: "pid", customID: "pageId" })
      return pages
    },
    showDel() {
      return this.pages.length !== 1
    }
  },
  data() {
    return {
      clickAdd: true
    }
  },
  created() {},
  methods: {
    clickAddFlag(val) {
      this.clickAdd = val
    },
    addPage() {
      if (!this.clickAdd) {
        // 新建页面请求成功后，才可以点击下一次新增
        return
      }
      const { width, height, pages } = this.$store.state.apply
      const len = pages.length + 1
      const newPageId = `newpage*${len}`
      let temp = {
        pageId: newPageId,
        width,
        height,
        pid: "",
        pageName: `页面 ${len}`,
        isEdit: true
      }
      this.$store.commit("addPage", temp)
      this.$store.commit("setCurrentPageId", newPageId)
    }
  }
}
</script>
<style lang="less">
.page-con {
  height: calc(80vh - 50px);
  .header {
    display: flex;
    justify-content: space-between;
    font-weight: 500;
    color: #040c2c;
    align-items: center;
    padding: 9px 10px;
    border-bottom: solid 1px #e5e6e9;
    .icon {
      font-size: 12px;
      cursor: pointer;
    }
  }
  .scroll-con {
    height: calc(100% - 40px);
    overflow: hidden auto;
    border-bottom: solid 1px #e5e6e9;
  }
}
</style>

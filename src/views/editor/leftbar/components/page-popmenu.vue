<template>
  <ul
    v-if="show"
    :style="styleObj"
    class="page-pop-menu"
    @mouseleave="hidePagePopMenu"
  >
    <li
      class="page-pop-menu-item"
      @click="setHome"
      v-if="!page.pid && !page.isHome"
    >
      设为首页
    </li>
    <li class="page-pop-menu-item" @click="addChildPage" v-if="!page.pid">
      添加子页面
    </li>
    <li class="page-pop-menu-item" @click="copy">复制页面</li>
    <li class="page-pop-menu-item" @click="del" v-if="showDel">删除</li>
  </ul>
</template>
<script>
import pageApi from "@a/page"
export default {
  name: "PagePopmenu",
  props: {
    showDel: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      show: false,
      styleObj: {},
      page: {}
    }
  },
  created() {
    this.$bus.$on("showPagePopMenu", this.showPagePopMenu)
    this.$bus.$on("hidePagePopMenu", this.hidePagePopMenu)
  },
  mounted() {
    const component = this.$mount()
    document.querySelector("body").appendChild(component.$el)
  },
  beforeDestroy() {
    this.$bus.$off("showPagePopMenu")
    this.$bus.$off("hidePagePopMenu")
  },
  methods: {
    showPagePopMenu({ evt, page }) {
      this.show = true
      const { srcElement } = evt
      this.page = page
      const { left, top } = srcElement.getBoundingClientRect()
      this.styleObj = {
        left: `${left + 32}px`,
        top: `${top}px`
      }
    },
    hidePagePopMenu() {
      this.show = false
      this.$bus.$emit("updateHoverPageId", "")
    },
    setHome() {
      const pageId = this.page.pageId
      const oldPageId = this.$store.state.apply.pages[0].pageId
      pageApi.setHome({ oldPageId, pageId }).then(res => {
        if (res.code === 0) {
          this.$bus.$emit("changePage", { pageId })
          this.$store.commit("setHomePage", pageId)
          this.$store.commit("setPageInfo", { pageId, isHome: true })
          this.$store.commit("setPageInfo", {
            pageId: oldPageId,
            isHome: false
          })
          this.hidePagePopMenu()
          console.log("设置首页成功")
        }
      })
    },
    addChildPage() {
      const { width, height } = this.$store.state.apply
      let len = 0
      if(this.page.children) {
        len = this.page.children.length
      }
      const newPageId = `new-page-${len}`
      this.$store.commit("addPage", {
        pageId: newPageId,
        width,
        height,
        pid: this.page.pageId,
        pageName: `页面 ${++len}`,
        isEdit: true,
        level: 1 + parseInt(this.page.level)
      })
      this.$store.commit("setCurrentPageId", newPageId)
      this.hidePagePopMenu()
    },
    copy() {
      let len = 0
      if(this.page.children) {
        len = this.page.children.length
      } else {
        len = this.$store.state.apply.pages.length
      }
      const newPageId = `new-page-${++len}`
      const newPageName = `${this.page.pageName} Copy`
      this.$store.commit("addPage", {
        ...this.page,
        pageId: newPageId,
        pageName: newPageName,
        isEdit: true
      })
      this.$store.commit("setCurrentPageId", newPageId)
      this.hidePagePopMenu()
    },
    del() {
      const { pageId } = this.page
      this.$confirm({
        title: "提示",
        content: `确定要删除该页面吗？`,
        onOk: () => {
          pageApi.del(pageId).then(res => {
            if (res.code === 0) {
              this.$store.commit("delPage", this.page)
              this.$message.success("删除页面成功")
              this.hidePagePopMenu()
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
ul,
li {
  list-style: none;
}
.page-pop-menu {
  position: relative;
  position: absolute;
  z-index: 5000;
  padding: 4px 0px;
  background: rgb(255, 255, 255);
  box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 8px 0px;
  min-width: 94px;
  font-size: 12px;
  .page-pop-menu-item {
    display: flex;
    align-items: center;
    padding: 0px 16px;
    height: 26px;
    color: rgb(65, 80, 88);
    white-space: nowrap;
    cursor: pointer;
    &:hover {
      background: rgb(245, 245, 245);
      color: rgb(41, 141, 248);
    }
  }
}
</style>

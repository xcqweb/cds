<template>
  <ul class="page-menu-con">
    <li
      v-for="page in pages"
      :key="page.pageId"
      @dblclick.stop="dblclick(page)"
      @click.stop="changePage(page)"
    >
      <div
        class="menu-item"
        :class="{
          active: isCurrentPage(page),
          hover: page.pageId == hoverPageId
        }"
        :style="{ paddingLeft: `${page.level * 17}px` }"
      >
        <a
          class="expander"
          :class="{ 'is-expand': page.expand }"
          v-if="page.children"
          @click.stop.prevent="expand(page)"
          @dblclick.stop
        >
          <svg-icon icon-class="page-arrow" />
        </a>
        <div class="name-con">
          <div class="name-icon">
            <svg-icon
              :icon-class="`${page.isHome ? 'page-icon-home' : 'page-icon'}`"
              class-name="icon"
            />
          </div>
          <div class="name" :class="{ 'is-eidt': page.isEdit }">
            <input
              v-if="page.isEdit"
              v-model="page.pageName"
              v-focus
              @blur="hideEdit(page)"
            />
            <template v-else>{{ page.pageName }}</template>
          </div>
        </div>
        <div
          class="actions"
          v-if="!page.isEdit"
          @mouseenter="showPagePopMenu($event, page)"
          @moumove="showPagePopMenu($event, page)"
          :class="{ hover: page.pageId == hoverPageId }"
          @mouseout="mouseoutDeal($event)"
        >
          <svg-icon icon-class="page-action" class-name="icon" />
        </div>
        <svg-icon
          icon-class="page-dot"
          class-name="active-circle"
          v-if="isCurrentPage(page) && page.pageId != hoverPageId"
        />
      </div>
      <page-menu :pages="page.children" v-show="page.children && page.expand" />
    </li>
  </ul>
</template>
<script>
import pageApi from "@a/page"
import widgetApi from "@a/widget"
import { dealWidgetData, dealPageData } from "@u/deal"
export default {
  name: "PageMenu",
  props: {
    pages: {
      type: Array,
      default: () => []
    },
    clickAdd: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    currentPage() {
      return this.$store.getters.currentPage
    },
    applyId() {
      return this.$store.state.apply.id
    }
  },
  data() {
    return {
      hoverPageId: ""
    }
  },
  created() {
    this.$bus.$on("updateHoverPageId", this.updateHoverPageId)
    this.$bus.$on("changePage", this.changePage)
  },
  beforeDestroy() {
    this.$bus.$off("updateHoverPageId")
    this.$bus.$off("changePage")
  },
  methods: {
    isCurrentPage(page) {
      if (this.currentPage && this.currentPage.pageId == page.pageId) {
        return true
      }
      return false
    },
    dblclick({ pageId }) {
      this.$store.commit("setPageInfo", { pageId, isEdit: true })
    },
    loadPageData(pageId) {
      widgetApi.queryAll({ pageId }).then(res => {
        if (res.code === 0) {
          this.$store.commit("setCurrentPageWidgets", dealWidgetData(res.data))
        }
      })
    },
    changePage({ pageId }) {
      this.$store.dispatch("patchModifyWidgets", true)
      this.loadPageData(pageId)
      this.$store.commit("setCurrentPageId", pageId)
    },
    hideEdit({ pageName, pageId }) {
      if (!pageId.includes("pagecopy")) {
        this.$store.commit("setPageInfo", { pageName })
      }
      this.savePage(pageId)
    },
    savePage(pageId) {
      this.$emit("clickAddFlag", false)
      let method
      let tempPage
      this.isAdd = pageId.includes("newpage")
      this.isCopy = pageId.includes("pagecopy")
      if (this.isCopy) {
        const tempArr = pageId.split("*")
        tempPage = this.$store.state.apply.pages.find(
          item => item.pageId == tempArr[0]
        )
      } else {
        tempPage = this.$store.state.apply.pages.find(
          item => item.pageId == pageId
        )
      }
      let params = { ...tempPage, appId: this.applyId }
      let msg = ""
      let resObj
      if (this.isAdd) {
        method = "add"
        msg = `新建页面成功`
        params = { ...params, pageId: "" }
      } else if (this.isCopy) {
        method = "copy"
        params = { pageId: tempPage.pageId, pageName: tempPage.pageName }
        msg = `页面复制成功`
      } else {
        method = "modify"
        msg = `页面名称修改成功`
      }
      pageApi[method](params).then(res => {
        if (res.code === 0) {
          if (this.isCopy) {
            const tempArr = pageId.split("*")
            if (res.data) {
              resObj = { pageId, isEdit: false, newPageId: res.data.pageId }
              const temp = dealPageData(res.data)
              this.$store.commit("setPageInfo", { ...temp, ...resObj })
              this.loadPageData(tempArr[0])
            }
          } else {
            resObj = { pageId, isEdit: false }
            if (this.isAdd) {
              resObj = { ...resObj, newPageId: res.data.pageId }
            }
            this.$store.commit("setPageInfo", resObj)
          }
          this.$emit("clickAddFlag", true)
          this.$message.success(msg)
        }
      })
    },
    showPagePopMenu(evt, page) {
      this.hoverPageId = page.pageId
      this.$bus.$emit("showPagePopMenu", { evt, page })
    },
    mouseoutDeal(evt) {
      let target = evt.toElement || evt.relatedTarget
      const cls = target.className
      const clsArr = ["page-pop-menu"]
      let res = true
      for (let i = 0; i < clsArr.length; i++) {
        if (cls.includes(clsArr[i])) {
          res = false
        }
      }
      if (res) {
        this.$bus.$emit("hidePagePopMenu")
        this.hoverPageId = ""
      }
    },
    updateHoverPageId(val) {
      this.hoverPageId = val
    },
    expand(page) {
      const expand = !page.expand
      this.$store.commit("setPageInfo", { expand, pageId: page.pageId })
    }
  }
}
</script>
<style lang="less" scoped>
ul,
li {
  list-style: none;
  position: relative;
}
.page-menu-con {
  .menu-item {
    position: relative;
    height: 32px;
    padding-left: 14px;
    display: flex;
    align-items: center;
    border: 1px solid transparent;
    color: #040c2c;
    font-size: 12px;
    cursor: pointer;
    .expander {
      display: flex;
      width: 12px;
      margin-left: -12px;
      margin-right:2px;
      color: rgb(200, 205, 208);
      &.is-expand {
        transform: rotate(90deg);
      }
    }
    .name-con {
      display: flex;
      align-items: center;
      width: 100%;
      padding-right: 5px;
      .name-icon {
        display: flex;
        flex-shrink: 0;
        justify-content: center;
        align-items: center;
        width: 16px;
        height: 16px;
        margin-right: 5px;
        .icon {
          width: 16px;
          height: 16px;
          color: rgb(141, 158, 167);
        }
      }
      .name {
        width: 100%;
        height: 24px;
        line-height: 22px;
        border-top: 1px solid transparent;
        border-bottom: 1px solid transparent;
        margin-right: 14px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        &.is-eidt {
          border-bottom: 1px solid rgb(245, 93, 84);
        }
        input {
          border: none;
          outline: none;
          width: 100%;
          height: 100%;
          background: transparent;
          color: rgb(82, 94, 113);
          white-space: nowrap;
          overflow: hidden;
        }
      }
    }
    .actions {
      display: none;
      position: absolute;
      top: 0px;
      right: 0px;
      height: 100%;
      padding: 0 10px;
      background: inherit;
      align-items: center;
      color: rgb(141, 158, 167);
      .icon {
        font-size: 14px;
        pointer-events: none;
        color: currentColor;
      }
      &:hover,
      &.hover {
        color:#1740DC;
      }
    }
    .active-circle {
      position: absolute;
      right: 10px;
      width: 6px;
      height: 6px;
      color:#1740DC;
    }
    &.hover,
    &:hover {
      background:#F3F5FD;
      color: unset;
      .actions {
        display: flex;
      }
      .active-circle {
        display: none;
      }
    }
    &.active {
      color:#1740DC;
      background:#F3F5FD;
      .expander {
        color:#1740DC;
      }
      .name-icon {
        .icon {
          color:#1740DC;
        }
      }
    }
  }
}
</style>

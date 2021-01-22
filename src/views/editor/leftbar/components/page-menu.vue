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
        :style="{ paddingLeft: `${page.level * 14}px` }"
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
            <svg-icon icon-class="page-icon" class-name="icon" />
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
import { dealWidgetData } from "@u/deal"
export default {
  name: "PageMenu",
  props: {
    pages: {
      type: Array,
      default: () => []
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
    changePage({ pageId }) {
      this.$store.dispatch("patchModifyWidgets", true)
      widgetApi.queryAll({ pageId }).then(res => {
        if (res.code === 0) {
          this.$store.commit("setCurrentPageWidgets", dealWidgetData(res.data))
        }
      })
      this.$store.commit("setCurrentPageId", pageId)
    },
    hideEdit({ pageName, pageId }) {
      this.$store.commit("setPageInfo", { pageName })
      this.savePage(pageId)
    },
    savePage(pageId) {
      let method
      const tempPage = this.$store.state.apply.pages.find(
        item => item.pageId == pageId
      )
      let params = { ...tempPage, appId: this.applyId }
      let msg = ""
      this.isAdd = params.pageId.includes("new-page-")
      if (this.isAdd) {
        method = "add"
        msg = `新建页面成功`
        params = { ...params, pageId: "" }
      } else {
        method = "modify"
        msg = `页面名称修改成功`
      }
      pageApi[method](params).then(res => {
        if (res.code === 0) {
          let resObj = { pageId, isEdit: false }
          if (this.isAdd) {
            resObj = { ...resObj, newPageId: res.data.pageId }
          }
          this.$store.commit("setPageInfo", resObj)
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
        width: 14px;
        height: 14px;
        margin-right: 8px;
        .icon {
          width: 9px;
          height: 12px;
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
        color: rgb(41, 141, 248);
      }
    }
    .active-circle {
      position: absolute;
      right: 10px;
      width: 6px;
      height: 6px;
      color: rgb(41, 141, 248);
    }
    &.hover,
    &:hover {
      background: rgb(247, 247, 247);
      color: unset;
      .actions {
        display: flex;
      }
      .active-circle {
        display: none;
      }
    }
    &.active {
      color: rgb(41, 141, 248);
      background: rgb(242, 248, 255);
      .expander {
        color: rgb(41, 141, 248);
      }
      .name-icon {
        .icon {
          color: rgb(41, 141, 248);
        }
      }
    }
  }
}
</style>

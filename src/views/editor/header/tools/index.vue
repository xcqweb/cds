<template>
  <div class="toolbar-con ge-colorg">
    <div class="tools">
      <div class="left goback">
        <svg-icon icon-class="arrow" />
        <span style="margin-left: 20px">新增应用</span>
      </div>
      <div class="sub">
        <div class="geToolbar">
          <!-- 撤销-重做 -->
          <div class="center-main">
            <div class="ge-pa28" @click="undo">
              <span class="ge-text">
                <svg-icon icon-class="undo" class-name="side-nav-icon" />
              </span>
              <span style="display:block">撤销</span>
            </div>
            <div class="ge-pa28" @click="redo">
              <span class="ge-text">
                <svg-icon icon-class="redo" class-name="side-nav-icon" />
              </span>
              <span style="display:block">重做</span>
            </div>
          </div>
        </div>
        <!-- 基本操作；对齐等 -->
        <div class="geToolbar">
          <div class="center-main">
            <div class="ge-pa28">
              <a-dropdown>
                <a class="ant-dropdown-link" @click="e => e.preventDefault()">
                  <span class="ge-text">
                    <svg-icon icon-class="center" class-name="side-nav-icon" />
                  </span>
                  <span style="display:block">
                    对齐
                  </span>
                </a>
                <a-menu slot="overlay">
                  <adjust-position></adjust-position>
                </a-menu>
              </a-dropdown>
            </div>
            <div class="ge-pa28">
              <span class="ge-text">
                <svg-icon icon-class="top" class-name="side-nav-icon" />
              </span>
              <span style="display:block">置顶</span>
            </div>
            <div class="ge-pa28">
              <span class="ge-text">
                <svg-icon icon-class="bottom" class-name="side-nav-icon" />
              </span>
              <span class="ge-text">置底</span>
            </div>
            <div class="ge-pa28" @click="group">
              <span class="ge-text">
                <svg-icon icon-class="group" class-name="side-nav-icon" />
              </span>
              <span>组合</span>
            </div>
            <div class="ge-pa28" @click="ungroup">
              <span class="ge-text">
                <svg-icon icon-class="ungroup" class-name="side-nav-icon" />
              </span>
              <span style="display:block">解散</span>
            </div>
          </div>
        </div>
        <div>
          <span>自动保存</span>
          <span>{{ time }}</span>
        </div>
      </div>
      <div class="right">
        <div class="geToolbar">
          <!-- 撤销-重做 -->
          <div class="center-main">
            <div class="ge-pa20" @click="saveApply">
              <a-dropdown>
                <a class="ant-dropdown-link" @click="e => e.preventDefault()">
                  <span class="ge-text">
                    <svg-icon icon-class="canvas" class-name="side-nav-icon" />
                  </span>
                  <span style="display:block">
                    画布
                  </span>
                </a>
                <a-menu slot="overlay">
                  <grid></grid>
                </a-menu>
              </a-dropdown>
            </div>
            <div class="ge-pa20" style="margin-right: 37px">
              <span class="ge-text" style="width: 63px">
                <a-select
                  :value="pageScale"
                  :not-found-content="null"
                  :show-arrow="true"
                  @change="handleChange"
                >
                  <a-select-option v-for="item in list" :value="item.value">
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </span>
              <span style="display:block;text-align:center;width:63px"
                >缩放</span
              >
            </div>
            <div class="ge-pa20" @click="saveApply">
              <span class="ge-text">
                <svg-icon icon-class="save" class-name="side-nav-icon" />
              </span>
              <span style="display:block">保存</span>
            </div>
            <div class="ge-pa20" @click="preview">
              <span class="ge-text">
                <svg-icon icon-class="run" class-name="side-nav-icon" />
              </span>
              <span class="ge-text">运行</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import adjustPosition from "../adjust-position"
import helpComputed from "@/mixins/help-computed"
import grid from "./grid"
import { currentTime } from "@/utils/time"
import undoManager from "@u/undo-manager"
import helpMethods from "@/mixins/help-methods"
import { uuid } from "@u/uuid"
import config from "@/config"
import { findWidgetById, findWidgetChildren, isGroup } from "@u/deal"
export default {
  components: {
    adjustPosition,
    grid
  },
  mixins: [helpMethods, helpComputed],
  data() {
    return {
      time: "",
      pageScale: "25",
      list: [
        { label: "25%", value: "25" },
        { label: "50%", value: "50" },
        { label: "75%", value: "75" },
        { label: "100%", value: "100" },
        { label: "125%", value: "125" },
        { label: "150%", value: "150" },
        { label: "200%", value: "200" },
        { label: "300%", value: "300" },
        { label: "400%", value: "400" },
        { label: "全屏", value: "全屏" }
      ],
      showRuler: true,
      isFullscreen: false
    }
  },

  created() {
    this.time = currentTime(new Date(), "time")
    this.showRuler = this.$store.state.ruler.showRuler
  },
  methods: {
    //全屏方法
    isScreenFull() {
      // 需要注意的是 如果判断!screenfullInfo.enabled 显示的是不支持全屏的话 是因为谷歌的版本问题  判断改为 !screenfullInfo.isEnabled  就可以了

      if (!screenfull.isEnabled) {
        return false
      }
      screenfull.toggle()
    },
    save() {
      this.time = currentTime(new Date(), "time")
    },
    undo() {
      undoManager.applyUndo()
    },
    redo() {
      undoManager.applyRedo()
    },
    group() {
      let widgets = this.$store.getters.selectWidgets
      const cid = `${uuid(16, 16)}`
      const cname = config.groupName
      const name = `组合`
      const attrs = this.calculateSelectWidgets(widgets)
      widgets.forEach(item => {
        if (isGroup(item)) {
          this.ungroup(null, item)
        }
      })
      widgets = this.$store.getters.selectWidgets
      widgets.forEach(item => {
        let left = item.attrs.left - attrs.left
        let top = item.attrs.top - attrs.top
        this.$store.commit("updateWidgetAttrs", { left, top, cid: item.cid })
        this.$store.commit("updateWidget", {
          pid: cid,
          active: false,
          cid: item.cid
        })
      })
      this.$store.commit("widgetAdd", { cid, cname, name, ...attrs })
      const tempWidget = findWidgetById(
        this.$store.getters.currentPage.widgets,
        cid
      )
      this.$store.commit("setGroupSelection", {
        show: true,
        widget: tempWidget
      })
    },
    ungroup(evt, widget) {
      if (!widget) {
        widget = this.$store.getters.currentWidget
      }
      if (isGroup(widget)) {
        const childWidgets = findWidgetChildren(
          this.$store.getters.currentPage.widgets,
          widget
        )
        childWidgets.forEach(item => {
          let { left, top } = widget.attrs
          this.$store.commit("updateWidget", {
            pid: "",
            cid: item.cid,
            active: true
          })
          left = item.attrs.left + left
          top = item.attrs.top + top
          this.$store.commit("updateWidgetAttrs", { left, top, cid: item.cid })
        })
        this.$store.commit("widgetDel", [widget])
      }
    },
    saveApply() {
      this.$store.dispatch("patchModifyWidgets")
    },
    preview() {
      const url = this.$router.resolve({
        path: "/preview-app"
      })
      window.open(url.href, "_blank")
    },
    //画布缩放
    handleChange(value) {
      this.pageScale = value
      if (value !== "全屏") {
        this.$store.commit("setPageInfo", { scale: value / 100 })
      }
    }
  }
}
</script>
<style lang="less">
.toolbar-con {
  .tools {
    flex: 1 1 0%;
    display: flex;
    justify-content: space-between;
    height: 54px;
    font-size: 12px;
    .left {
      font-size: 14px;
      cursor: pointer;
      width: 280px;
      padding-left: 20px;
      height: 54px;
      line-height: 54px;
    }
    .sub {
      flex: 1 1 0%;
      display: flex;
      min-width: 400px;
      justify-content: space-between;
      align-items: center;
      span {
        width: 24px;
      }
    }
    .right {
      width: 230px;
      margin-left: 30px;

      span {
        width: 24px;
      }
    }
    .geToolbar {
      box-sizing: border-box;
      flex: 1 1 auto;
    }
    .center-main {
      display: flex;
      align-items: center;
    }
    .ge-pa28 {
      padding: 6px;
      margin-right: 28px;
      cursor: pointer;
    }
    .ge-pa20 {
      padding: 6px 0px;
      margin-right: 20px;
      cursor: pointer;
    }
    .ge-text {
      text-align: center;
      display: block;
    }
    .ge-pa20:active,
    .ge-pa20:hover,
    .ge-pa20:focus,
    .ge-pa28:active,
    .ge-pa28:hover,
    .ge-pa28:focus {
      color: #1890ff;
    }
    .goback:active,
    .goback:hover,
    .goback:focus {
      color: #1890ff;
    }
    a {
      color: #5b6b73;
    }
    a:active,
    a:hover,
    a:focus {
      color: #1890ff;
    }
    .side-nav-icon {
      width: 1.4em;
      height: 1.4em;
      color: rgb(141, 158, 167);
    }
  }
  .ant-select {
    width: 63px;
  }
  .ant-select-selection--single .ant-select-selection__rendered {
    margin-right: 0px;
  }
  .ant-select-selection--single {
    height: 20px;
  }
  .ant-select-selection__rendered {
    line-height: 20px;
  }
  .ant-select-arrow {
    right: -4px;
  }
}
.ant-select-dropdown-menu-item {
  padding: 5px 4px;
}
</style>

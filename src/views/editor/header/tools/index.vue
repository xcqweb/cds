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
            <div class="ge-pa10" @click="undo">
              <span class="ge-text">
                <svg-icon icon-class="undo" />
              </span>
              <span style="display:block">撤销</span>
            </div>
            <div class="ge-pa10" @click="redo">
              <span class="ge-text" style="transform: rotate(90deg);">
                 <svg-icon icon-class="redo" />
              </span>
              <span style="display:block">重做</span>
            </div>
          </div>
        </div>
        <!-- 基本操作；对齐等 -->
        <div class="geToolbar">
          <div class="center-main">
            <div class="ge-pa10">
              <a-dropdown>
                <a class="ant-dropdown-link" @click="e => e.preventDefault()">
                  <span class="ge-text">
                    <svg-icon icon-class="center" />
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
            <div class="ge-pa10">
              <span class="ge-text">
                  <svg-icon icon-class="top" />
              </span>
              <span style="display:block">置顶</span>
            </div>
            <div class="ge-pa10">
               <span class="ge-text">
                  <svg-icon icon-class="bottom" />
              </span>
               <span class="ge-text">置底</span>
            </div>
            <div class="ge-pa10" @click="group">
               <span class="ge-text">
                  <svg-icon icon-class="group" />
              </span>
               <span>组合</span>
            </div>
            <div class="ge-pa10" @click="ungroup">
              <span class="ge-text">
                  <svg-icon icon-class="ungroup" />
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
            <div class="ge-pa10" @click="saveApply">
              <a-dropdown>
                <a class="ant-dropdown-link" @click="e => e.preventDefault()">
                  <span class="ge-text">
                    <svg-icon icon-class="canvas" />
                  </span>
                  <span style="display:block">
                    画布
                  </span>
                </a>
                <a-menu slot="overlay">
                    <a-menu-item>
                      <svg-icon icon-class="left" />
                      <span  @click="changePosition('left')">左对齐</span>
                    </a-menu-item>
                    <a-menu-item>
                      <svg-icon icon-class="right" />
                      <span  @click="changePosition('right')">右对齐</span>
                    </a-menu-item>
                    <a-menu-item>
                      <svg-icon icon-class="tc" />
                      <span  @click="changePosition('top')">上对齐</span>
                    </a-menu-item>
                  </a-menu>
              </a-dropdown>
            </div>
            <div class="ge-pa10" @click="saveApply">
              <a-dropdown>
                <a class="ant-dropdown-link" @click="e => e.preventDefault()">
                  <span class="ge-text">
                    <svg-icon icon-class="center" />
                  </span>
                  <span style="display:block">
                    缩放
                  </span>
                </a>
                <a-menu slot="overlay">
                    <a-menu-item>
                      <svg-icon icon-class="left" />
                      <span  @click="changePosition('left')">左对齐</span>
                    </a-menu-item>
                    <a-menu-item>
                      <svg-icon icon-class="right" />
                      <span  @click="changePosition('right')">右对齐</span>
                    </a-menu-item>
                    <a-menu-item>
                      <svg-icon icon-class="tc" />
                      <span  @click="changePosition('top')">上对齐</span>
                    </a-menu-item>
                </a-menu>
              </a-dropdown>
            </div>
            <div class="ge-pa10" @click="saveApply">
              <span class="ge-text">
                <svg-icon icon-class="save" />
              </span>
              <span style="display:block">保存</span>
            </div>
            <div class="ge-pa10" @click="preview">
              <span class="ge-text">
                <svg-icon icon-class="run" />
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
import { currentTime } from "@/utils/time"
import undoManager from "@u/undo-manager"
import helpMethods from "@/mixins/help-methods"
import { uuid } from "@u/uuid"
import config from "@/config"
import { findWidgetById, findWidgetChildren, isGroup } from "@u/deal"
export default {
  components: {
    adjustPosition
  },
  mixins: [helpMethods],
  data() {
    return {
      time: ""
    }
  },
  created() {
    this.time = currentTime(new Date(), "time")
  },
  methods: {
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
    }
  }
}
</script>
<style lang="less" scoped>
.tools {
  flex: 1 1 0%;
  display: flex;
  justify-content: space-between;
  height: 54px;
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
    font-size: 14px;
    justify-content: space-between;
    align-items: center;
  }
  .right {
    width: 230px;
    margin-left: 30px;
    font-size: 14px;
  }
  .geToolbar {
    box-sizing: border-box;
    flex: 1 1 auto;
  }
  .center-main {
    display: flex;
    align-items: center;
  }
  .ge-pa10 {
    padding: 6px;
    margin-right: 16px;
    cursor: pointer;
  }
  .ge-text {
    text-align: center;
    display: block;
  }
  .ge-pa10:active,
  .ge-pa10:hover,
  .ge-pa10:focus {
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
}
</style>

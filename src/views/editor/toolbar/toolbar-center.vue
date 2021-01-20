<template>
  <div class="toolbar-center">
    <div>
      <a class="center-item" @click.prevent="undo">
        <svg-icon icon-class="undo" class-name="icon" />
        <span>撤销</span>
      </a>
      <a class="center-item" @click.prevent="redo">
        <svg-icon icon-class="redo" class-name="icon" />
        <span>重做</span>
      </a>
      <a class="center-item" @click.prevent>
        <a-dropdown>
          <div>
            <div style="display:flex;margin-bottom:3px;">
              <svg-icon icon-class="canvas" class-name="icon" />
              <svg-icon
                icon-class="arrow-down"
                slot="icon"
                style="margin-left:3px;"
              />
            </div>
            <span>画布</span>
          </div>
          <a-menu slot="overlay">
            <a-menu-item>
              <a-checkbox v-model="ruleModel">
                标尺
              </a-checkbox>
            </a-menu-item>
            <a-menu-item>
              <a-checkbox v-model="gridModel">
                网格
              </a-checkbox>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </a>
      <a class="center-item room-item">
        <a-dropdown>
          <div>{{ scaleText }} <a-icon type="down" /></div>
          <a-menu slot="overlay">
            <a-menu-item
              v-for="(item, index) in scaleList"
              :key="index"
              @click="changeScale(item)"
            >
              {{ item * 100 }}%
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </a>
    </div>

    <div>
      <a class="center-item" @click.prevent>
        <a-dropdown>
          <div>
            <div style="display:flex;margin-bottom:3px;">
              <svg-icon :icon-class="alignModel" class-name="icon" />
              <svg-icon
                icon-class="arrow-down"
                slot="icon"
                style="margin-left:3px;"
              />
            </div>
            <span>对齐</span>
          </div>
          <a-menu slot="overlay">
            <a-menu-item
              v-for="item in alignList"
              :key="item.value"
              @click="dealAlign(item)"
            >
              <svg-icon :icon-class="item.value" class-name="icon" />
              {{ item.label }}
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </a>
      <a class="center-item" @click.prevent="toTop">
        <svg-icon icon-class="to-top" class-name="icon" />
        <span>置顶</span>
      </a>
      <a class="center-item" @click.prevent="toBottom">
        <svg-icon icon-class="to-bottom" class-name="icon" />
        <span>置底</span>
      </a>
      <a class="center-item" @click.prevent="group">
        <svg-icon icon-class="group" class-name="icon" />
        <span>组合</span>
      </a>
      <a class="center-item" @click.prevent="ungroup">
        <svg-icon icon-class="ungroup" class-name="icon" />
        <span>解散</span>
      </a>
    </div>
    <div>
      <div class="center-item" style="width:auto;">自动保存 {{ saveTime }}</div>
    </div>
  </div>
</template>
<script>
import helpComputed from "@/mixins/help-computed"
import helpMethods from "@/mixins/help-methods"
import baseOperate from "@/mixins/base-operate"
import undoManager from "@u/undo-manager"
export default {
  name: "ToolbarCenter",
  mixins: [helpMethods, helpComputed, baseOperate],
  computed: {
    ruleModel: {
      get() {
        return this.$store.state.apply.ruleEnable == 1
      },
      set(val) {
        this.$store.dispatch("updateApply", { ruleEnable: val ? 1 : 0 })
      }
    },
    gridModel: {
      get() {
        return this.$store.state.apply.gridEnable == 1
      },
      set(val) {
        this.$store.dispatch("updateApply", { gridEnable: val ? 1 : 0 })
      }
    },
    scaleText: {
      get() {
        let res = 1
        if(this.$store.state.apply.scale) {
          res = this.$store.state.apply.scale
        }
        return  res* 100 + "%"
      },
      set(scale) {
        this.$store.dispatch("updateApply", { scale })
      }
    },
    selectWidgetsCount() {
      return this.selectWidgets.length
    },
    saveTime() {
      let date = this.$store.state.saveTime
      date = new Date(date)
      return date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
    }
  },
  data() {
    return {
      scaleList: [0.25, 0.5, 0.75, 1, 1.5, 2.0, 3.0],
      alignModel: "left",
      alignList: [
        { value: "left", label: "左对齐" },
        { value: "right", label: "右对齐" },
        { value: "top", label: "顶部对齐" },
        { value: "bottom", label: "底部对齐" },
        { value: "center", label: "水平居中" },
        { value: "middle", label: "垂直居中" }
      ]
    }
  },
  methods: {
    changeScale(item) {
      this.scaleText = item
    },
    dealAlign(item) {
      if (!this.selectWidgetsCount) {
        return
      }
      const attrs = this.calculateSelectWidgets(this.selectWidgets)
      let left = 0
      let top = 0
      switch (item.value) {
        case "left":
          if (this.selectWidgetsCount > 1) {
            left = attrs.left
          }
          this.$store.commit("updateWidgetAttrsPatch", { left })
          break
        case "right":
          if (this.selectWidgetsCount > 1) {
            left = attrs.right
            this.selectWidgets.forEach(item => {
              this.$store.commit("updateWidgetAttrs", {
                left: left - item.attrs.width,
                cid: item.cid
              })
            })
          } else {
            left = this.currentPage.width - this.currentWidget.attrs.width
            this.$store.commit("updateWidgetAttrs", { left })
          }
          break
        case "top":
          if (this.selectWidgetsCount > 1) {
            top = attrs.top
          }
          this.$store.commit("updateWidgetAttrsPatch", { top })
          break
        case "bottom":
          if (this.selectWidgetsCount > 1) {
            top = attrs.bottom
            this.selectWidgets.forEach(item => {
              this.$store.commit("updateWidgetAttrs", {
                top: top - item.attrs.height,
                cid: item.cid
              })
            })
          } else {
            top = this.currentPage.height - this.currentWidget.attrs.height
            this.$store.commit("updateWidgetAttrs", { top })
          }
          break
        case "center":
          if (this.selectWidgetsCount > 1) {
            this.selectWidgets.forEach(item => {
              left = attrs.centerX - item.attrs.width / 2
              this.$store.commit("updateWidgetAttrs", { left, cid: item.cid })
            })
          } else {
            left = (this.currentPage.width - this.currentWidget.attrs.width) / 2
            this.$store.commit("updateWidgetAttrs", { left })
          }
          break
        case "middle":
          if (this.selectWidgetsCount > 1) {
            this.selectWidgets.forEach(item => {
              top = attrs.centerY - item.attrs.height / 2
              this.$store.commit("updateWidgetAttrs", { top, cid: item.cid })
            })
          } else {
            top =
              (this.currentPage.height - this.currentWidget.attrs.height) / 2
            this.$store.commit("updateWidgetAttrs", { top })
          }
          break
      }
      this.alignModel = item.value
    },

    undo() {
      undoManager.applyUndo()
    },
    redo() {
      undoManager.applyRedo()
    }
  }
}
</script>
<style lang="less">
.toolbar-center {
  flex: 1 1 0%;
  display: flex;
  justify-content: space-between;
  height: 100%;
  padding: 0px 25px;
  & > div {
    display: flex;
  }
  .center-item {
    position: relative;
    height: 100%;
    width: 44px;
    color: rgb(91, 107, 115);
    border-top: 2px solid transparent;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .icon {
      font-size: 16px;
    }
    span {
      color: #040c2c;
      border-top: 2px solid transparent;
    }
    .ant-dropdown-trigger {
      text-align: center;
    }
    &.room-item {
      width: 68px;
      margin-left: 15px;
    }
  }
}
.ant-checkbox-wrapper {
  font-size: 12px;
  height: auto;
}
</style>

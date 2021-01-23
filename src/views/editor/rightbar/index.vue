<template>
  <div class="right-con">
    <page-style v-if="isPage && !textEditorShowFlag" />
    <a-tabs v-else size="small" :animated="false">
      <a-tab-pane key="style" tab="样式">
        <widget-style />
      </a-tab-pane>
      <a-tab-pane key="mutual" tab="交互">
        <mutual />
      </a-tab-pane>
      <a-tab-pane key="data" tab="数据" v-if="showDataTab">
        <datasource />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
import PageStyle from "./page.vue"
import WidgetStyle from "./style"
import Mutual from "./mutual"
import Datasource from "./data"
const showDataWidgetList = ["GtRect", "GtCircle", "GtText"]
import helpComputed from "@/mixins/help-computed"
export default {
  mixins: [helpComputed],
  components: {
    PageStyle,
    WidgetStyle,
    Mutual,
    Datasource
  },
  computed: {
    isPage() {
      return this.$store.getters.selectWidgets.length == 0
    },
    textEditorShowFlag() {
      // 编辑控件文本
      return this.textEditor.show
    },
    showDataTab() {
      let cname = ""
      cname = this.currentWidget.cname
      return showDataWidgetList.includes(cname)
    }
  },
  data() {
    return {}
  },
  methods: {}
}
</script>
<style lang="less">
.right-con {
  position: relative;
  width: 230px;
  display: flex;
  z-index: 4;
  box-shadow: 0px 2px 7px 0px rgba(0, 9, 43, 0.09);
  background-color: #ffffff;
  .item-con {
    padding: 9px 10px;
    border-bottom: solid 1px #e5e6e9;
    &.no-border {
      border: none;
    }
    .label-block {
      display: block;
      margin-bottom: 10px;
    }
  }
  .fs {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .fc {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .fv {
    // 垂直
    display: flex;
    align-items: center;
  }
  .ant-tabs {
    width: 100%;
    overflow: unset;
    font-size: 12px;
    .ant-tabs-bar {
      margin-bottom: 0;
    }
    .ant-tabs-tab {
      color: #040c2c;
      padding: 8px 24px;
      margin-right: 0;
      &:hover,
      &-active {
        color: #1740dc;
      }
    }
    .ant-tabs-ink-bar {
      background-color: #1740dc;
    }
  }
  .ant-input-affix-wrapper .ant-input-suffix {
    right: 6px;
  }
  .ant-input-affix-wrapper .ant-input:not(:last-child) {
    padding-right: 15px;
  }
  .ant-input {
    border-radius: 2px;
    border: 1px solid #f0f1f3;
    font-size: 12px;
    color: #040c2c;
    &:focus,
    &:hover {
      box-shadow: unset;
      border-color: #40a9ff;
    }
  }
}
</style>

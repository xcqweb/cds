<template>
  <div
    v-if="visible"
    :style="objStyle"
    class="ds-panel-con"
    v-click-out-side="hide"
  >
    <a-tabs size="small" :animated="false" class="content-con">
      <a-tab-pane key="all" :tab="allText">
        <ul>
          <li
            v-for="item in list"
            :key="item.id"
            :value="item.value"
            @click="itemClick(item)"
          >
            {{ item.name }}
          </li>
        </ul>
      </a-tab-pane>
      <a-tab-pane key="recent" :tab="recentText">
        <ul>
          <li v-for="item in recentList" :key="item.id" :value="item.value">
            {{ item.name }}
          </li>
        </ul>
      </a-tab-pane>
    </a-tabs>
    <div class="footer">
      <a-button size="small" @click="hide">取消</a-button>
      <a-button size="small" type="primary" style="margin-left:10px;"
        >确定</a-button
      >
    </div>
  </div>
</template>
<script>
export default {
  name: "DatasourcePanel",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    objStyle: Object,
    allText: String,
    recentText: {
      type: String,
      default: "最近使用"
    },
    list: Array,
    recentLocalKey: String
  },
  components: {},
  data() {
    return {
      recentList: []
    }
  },
  mounted() {
    this.recentList = JSON.stringify(localStorage.getItem[this.recentLocalKey])
  },
  methods: {
    hide() {
      this.$emit("update:visible", false)
    },
    itemClick(item) {
      localStorage.setItem(this.recentLocalKey, JSON.stringify(item))
      this.$emit("itemClick", item)
    }
  }
}
</script>
<style lang="less" scoped>
.ds-panel-con {
  position: absolute;
  background-color: #fff;
  left: calc(-100% + 19px);
  top: 120px;
  box-shadow: 0px 2px 6px 0px rgba(4, 12, 44, 0.25);
  border-radius: 2px;
  border: 1px solid #e6e7ea;
  .content-con {
    max-height: 40vh;
    overflow: auto;
    border-bottom: solid 1px #e5e6e9;
  }
  .footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 10px;
  }
  .ant-btn-sm {
    font-size: 12px;
  }
}
</style>

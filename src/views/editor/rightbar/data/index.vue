<template>
  <div class="data-con">
    <div class="item-con no-border">
      <label class="label-block">数据源</label>
      <a-select v-model="dsType" size="small" style="width:100%;">
        <a-select-option
          v-for="item in dsList"
          :key="item.value"
          :value="item.value"
        >
          {{ item.label }}
        </a-select-option>
      </a-select>
    </div>
    <template v-if="dsType == 'device'">
      <div class="item-con no-border">
        <label class="label-block">模型</label>
        <div class="data-item-wrap fv" @click="chooseModel">
          <svg-icon icon-class="add" class-name="icon" />
          <span>选择模型</span>
        </div>
      </div>
      <div class="item-con no-border">
        <label class="label-block" @click="chooseDevice">设备</label>
        <div class="data-item-wrap fv">
          <svg-icon icon-class="add" class-name="icon" />
          <span>选择设备</span>
        </div>
      </div>
      <div class="item-con no-border">
        <label class="label-block">数据项</label>
        <a-radio-group v-model="dataItem" @change="dataItemChange">
          <a-radio
            :value="item.value"
            v-for="item in dataItemList"
            :key="item.value"
          >
            {{ item.label }}
          </a-radio>
        </a-radio-group>
        <div class="data-item-wrap fv" @click="chooseDataItem">
          <svg-icon icon-class="add" class-name="icon" />
          <span>{{ chooseDataItemText }}</span>
        </div>
      </div>
    </template>
    <datasource-panel
      :visible.sync="visible"
      :all-text="allText"
      :recent-local-key="recentKey"
      :list="list"
    />
  </div>
</template>
<script>
import DatasourcePanel from "@c/datasource-panel"
export default {
  name: "Datasource",
  components: {
    DatasourcePanel
  },
  data() {
    return {
      dsList: [
        { label: "设备", value: "device" },
        { label: "自定义数据源", value: "custom" }
      ],
      dsType: "device",
      datasource: {},
      chooseDataItemText: "选择属性",
      dataItem: "property",
      dataItemList: [
        { label: "属性", value: "property" },
        { label: "参数", value: "param" },
        { label: "状态", value: "state" }
      ],
      visible: false,
      allText: "全部模型",
      recentKey: "model",
      list: []
    }
  },
  methods: {
    dataItemChange(evt) {
      switch (evt.target.value) {
        case "property":
          this.chooseDataItemText = "选择属性"
          break
        case "param":
          this.chooseDataItemText = "选择参数"
          break
        case "state":
          this.chooseDataItemText = "选择状态"
          break
      }
    },
    chooseModel() {
      this.visible = true
    },
    chooseDevice() {},
    chooseDataItem() {}
  }
}
</script>
<style lang="less" scoped>
.data-con {
  .data-item-wrap {
    width: 100%;
    height: 30px;
    border-radius: 2px;
    border: 1px solid #f0f1f3;
    padding: 0 10px;
    cursor: pointer;
    .icon {
      font-size: 12px;
      cursor: pointer;
    }
    span {
      margin-left: 10px;
    }
  }
  .ant-radio-group {
    font-size: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    /depp/span.ant-radio + * {
      padding-right: 4px;
      padding-left: 4px;
    }
  }
}
</style>

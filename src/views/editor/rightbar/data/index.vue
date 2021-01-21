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
      <div class="item-con no-border" v-if="choosedData.deviceModelMark">
        <label class="label-block">设备</label>
        <div class="data-item-wrap fv"  @click="chooseDevice">
          <svg-icon icon-class="add" class-name="icon" />
          <span>选择设备</span>
        </div>
      </div>
      <div class="item-con no-border" v-if="choosedData.deviceName">
        <label class="label-block">数据项</label>
        <a-radio-group v-model="dataItem">
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
      :url="url"
      :dimUrl="dimUrl"
      :code="code"
      :dim-code="dimCode"
      :label-key="labelKey"
      :keywordKey="keywordKey"
      :valueKey="valueKey"
      :choosedData="choosedData"
      :paramType="paramType"
      @itemClick="itemClick"
    />
  </div>
</template>
<script>
import DatasourcePanel from "./components/datasource-panel"
import api from "@a/data"
import {findUrl} from '@u/deal'
export default {
  name: "Datasource",
  components: {
    DatasourcePanel
  },
  computed:{
    widgetId() {
      return this.$store.getters.currentWidget.cid
    },
    applyId() {
      return this.$store.state.apply.id
    },
    currentPageId() {
      return this.$store.getters.currentPageId
    }
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
      list: [],
      dataConfigList:[],
      url:'',
      dimUrl:'',
      code:'',
      dimCode:'',// 模糊查询的code
      labelKey:'',
      keywordKey:'',//搜索的关键字字段
      choosedData:{},
      valueKey:'',
      paramType:0,// 参数类型(0-属性1-参数2-状态)
    }
  },
  created() {
    this.getDatasourceConfig()
    this.getDataInfo()
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
    getDatasourceConfig() {
      api.dataUrlList({}).then(res=>{
        if(res.code === 0) {
          this.dataConfigList = res.data
        }
      })
    },
    getDataInfo() {
      api.query(this.widgetId).then(res=>{
        if(res.code == 0) {

        }
      })
    },
    chooseModel() {
      this.visible = true
      this.allText = '全部模型'
      this.recentKey = 'gt-cds-model-recent'
      this.code = 'E001'
      this.dimCode = 'E002'
      this.labelKey = 'modelName'
      this.keywordKey = 'deviceModelName'
      this.url = findUrl(this.dataConfigList,this.code)
      this.valueKey = 'mark'
    },
     
    chooseDevice() {
      this.visible = true
      this.allText = '全部设备'
      this.recentKey = 'gt-cds-device-recent'
      this.code = 'E003'
      this.dimCode = 'E004'
      this.labelKey = 'deviceName'
      this.keywordKey = 'deviceName'
      this.url = findUrl(this.dataConfigList,this.code)
      this.valueKey = 'deviceMark'
    },
    chooseDataItem() {
      this.visible = true
      this.code = 'E005'
      this.dimCode = 'E006'
      this.labelKey = 'paramName'
      this.keywordKey = 'paramName'
      this.valueKey = 'paramMark'
      this.url = findUrl(this.dataConfigList,this.code)
      switch(this.dataItem) {
        case 'property':
          this.allText = '全部属性'
          this.recentKey = 'gt-cds-property-recent'
          this.paramType = 0
          break
        case 'param':
          this.allText = '全部参数'
          this.recentKey = 'gt-cds-param-recent'
          this.paramType = 1
          break
        case 'state':
          this.paramType = 2
          break
      }
    },
    itemClick(item) {
      const itemValue = item[this.valueKey]
      const itemLabel = item[this.labelKey]
      switch(this.keywordKey) {
        case 'deviceModelName':
          this.choosedData.deviceModelMark = itemValue
          this.choosedData.deviceModelName = itemLabel
          break
        case 'deviceName':
          this.choosedData[this.valueKey] = itemValue
          this.choosedData[this.labelKey] = itemLabel
          break
        case 'paramName':
          this.choosedData[this.valueKey] = itemValue
          this.choosedData[this.labelKey] = itemLabel
          this.choosedData.paramType = item.paramType
          break
      }
      this.saveDataInfo()
    },
    saveDataInfo() {

    },
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

<template>
  <div class="data-con">
    <div class="item-con">
      <label class="label-block font14">数据源</label>
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
      <div class="item-con">
        <label class="label-block font14">模型</label>
        <div
          class="data-item-wrap fv"
          @click="chooseModel"
          v-if="!choosedData.deviceModelMark"
        >
          <svg-icon icon-class="add" class-name="icon" />
          <span>选择模型</span>
        </div>
        <div
          class="data-item-wrap fs"
          @click="chooseModel"
          v-if="choosedData.deviceModelMark"
        >
          {{ choosedData.deviceModelName }}
          <svg-icon
            icon-class="delete"
            class-name="icon"
            @click.native="delOperate('model')"
          />
        </div>
      </div>
      <div class="item-con" v-if="choosedData.deviceModelMark">
        <label class="label-block font14">设备</label>
        <div
          class="data-item-wrap fv"
          @click="chooseDevice"
          v-if="!choosedData.deviceMark"
        >
          <svg-icon icon-class="add" class-name="icon" />
          <span>选择设备</span>
        </div>
        <div
          class="data-item-wrap fs"
          @click="chooseDevice"
          v-if="choosedData.deviceMark"
        >
          {{ choosedData.deviceName }}
          <svg-icon
            icon-class="delete"
            class-name="icon"
            @click.native="delOperate('device')"
          />
        </div>
      </div>
      <div class="item-con" v-if="choosedData.deviceName">
        <label class="label-block font14">数据项</label>
        <a-radio-group v-model="dataItem">
          <a-radio
            :value="item.value"
            v-for="item in dataItemList"
            :key="item.value"
          >
            {{ item.label }}
          </a-radio>
        </a-radio-group>
        <div
          class="data-item-wrap fv"
          @click="chooseDataItem"
          v-if="!choosedData.paramMark"
        >
          <svg-icon icon-class="add" class-name="icon" />
          <span>{{ chooseDataItemText }}</span>
        </div>
        <div
          class="data-item-wrap fs"
          @click="chooseDevice"
          v-if="choosedData.paramMark"
        >
          {{ choosedData.paramName }}
          <svg-icon
            icon-class="delete"
            class-name="icon"
            @click.native="delOperate('param')"
          />
        </div>
        <div
          class="item-con no-border fv"
          v-if="dataItem == 'state'"
          style="padding-bottom:0;"
        >
          <a-radio-group v-model="stateModel" @change="stateChange">
            <a-radio
              :value="item.value"
              v-for="item in stateList"
              :key="item.value"
            >
              {{ item.label }}
            </a-radio>
          </a-radio-group>
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
import { findUrl } from "@u/deal"
export default {
  name: "Datasource",
  components: {
    DatasourcePanel
  },
  computed: {
    widgetId() {
      return this.$store.getters.currentWidget.cid
    },
    applyId() {
      return this.$store.state.apply.id
    },
    currentPageId() {
      return this.$store.state.currentPageId
    },
    dataConfigList() {
      return this.$store.state.dataConfigList
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
      url: "",
      dimUrl: "",
      code: "",
      dimCode: "", // 模糊查询的code
      labelKey: "",
      keywordKey: "", //搜索的关键字字段
      choosedData: {},
      valueKey: "",
      paramType: 0, // 参数类型(0-属性1-参数2-状态)
      stateModel: "deviceNetStatus",
      stateList: [
        { label: "网络状态", value: "deviceNetStatus" },
        { label: "运行状态", value: "deviceStatus" }
      ]
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
      if (!this.dataConfigList.length) {
        api.dataUrlList({}).then(res => {
          if (res.code === 0) {
            this.$store.commit("setDataConfigList", res.data)
          }
        })
      }
    },
    getDataInfo() {
      api
        .query({ widgetId: this.widgetId, pageId: this.currentPageId })
        .then(res => {
          if (res.code == 0) {
            this.choosedData = res.data || {}
          }
        })
    },
    chooseModel() {
      this.visible = true
      this.allText = "全部模型"
      this.recentKey = "gt-cds-model-recent"
      this.code = "E001"
      this.dimCode = "E002"
      this.labelKey = "modelName"
      this.keywordKey = "deviceModelName"
      this.url = findUrl(this.dataConfigList, this.code)
      this.valueKey = "mark"
    },

    chooseDevice() {
      this.visible = true
      this.allText = "全部设备"
      this.recentKey = "gt-cds-device-recent"
      this.code = "E003"
      this.dimCode = "E004"
      this.labelKey = "deviceName"
      this.keywordKey = "deviceName"
      this.url = findUrl(this.dataConfigList, this.code)
      this.valueKey = "deviceMark"
    },
    chooseDataItem() {
      this.visible = true
      this.code = "E005"
      this.dimCode = "E006"
      this.keywordKey = "paramName"
      this.url = findUrl(this.dataConfigList, this.code)
      switch (this.dataItem) {
        case "property":
          this.allText = "全部属性"
          this.recentKey = "gt-cds-property-recent"
          this.labelKey = "attributeName"
          this.valueKey = "attributeMark"
          this.paramType = 0
          break
        case "param":
          this.allText = "全部参数"
          this.recentKey = "gt-cds-param-recent"
          this.labelKey = "paramName"
          this.valueKey = "paramMark"
          this.paramType = 1
          break
        case "state":
          this.paramType = 2
          break
      }
    },
    itemClick(item) {
      const itemValue = item[this.valueKey]
      const itemLabel = item[this.labelKey]
      switch (this.keywordKey) {
        case "deviceModelName":
          this.choosedData.deviceModelMark = itemValue
          this.choosedData.deviceModelName = itemLabel
          break
        case "deviceName":
          this.choosedData.deviceMark = itemValue
          this.choosedData.deviceName = itemLabel
          break
        case "paramName":
          this.choosedData.paramMark = itemValue
          this.choosedData.paramName = itemLabel
          this.choosedData.paramType = item.paramType
          break
      }
      this.saveDataInfo()
    },
    stateChange(evt) {
      const { value } = evt.target
      this.choosedData.paramMark = value
      if (value == "deviceNetStatus") {
        this.choosedData.paramName = "网络状态"
      } else if (value == "deviceStatus") {
        this.choosedData.paramName = "运行状态"
      }
      this.saveDataInfo()
    },
    saveDataInfo() {
      const studioDataSourceId = this.dataConfigList.find(
        item => item.functionCode == "E007"
      ).id
      let params = {
        appId: this.applyId,
        deviceModelMark: this.choosedData.deviceModelMark,
        deviceModelName: this.choosedData.deviceModelName,
        deviceMark: this.choosedData.deviceMark,
        deviceName: this.choosedData.deviceName,
        pageId: this.currentPageId,
        paramMark: this.choosedData.paramMark,
        paramName: this.choosedData.paramName,
        paramType: this.choosedData.paramType,
        studioDataSourceId,
        widgetId: this.widgetId
      }
      if (this.choosedData.id) {
        params.id = this.choosedData.id
        api.edit(params).then(res => {
          if (res.code == 0) {
            this.$message.success("修改成功")
          }
        })
      } else {
        api.add(params).then(res => {
          if (res.code == 0) {
            this.$message.success("保存成功")
          }
        })
      }
    },
    delDataInfo() {
      api
        .del({ widgetId: this.widgetId, pageId: this.currentPageId })
        .then(res => {
          if (res.code === 0) {
            this.$message.success("删除模型绑定成功")
          }
        })
    },
    delOperate(type) {
      switch (type) {
        case "model":
          this.delDataInfo()
          break
        case "device":
          this.choosedData.deviceMark = ""
          this.choosedData.deviceName = ""
          this.saveDataInfo()
          break
        case "param":
          this.choosedData.paramMark = ""
          this.choosedData.paramName = ""
          this.choosedData.paramType = 0
          this.saveDataInfo()
          break
      }
    }
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
  .font14 {
    font-size: 14px;
    font-weight: bold;
  }
  .ant-radio-group {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    /depp/span.ant-radio + * {
      padding-right: 4px;
      padding-left: 4px;
    }
    /deep/span {
      font-size: 12px;
    }
  }
}
</style>

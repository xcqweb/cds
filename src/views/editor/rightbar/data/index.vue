<template>
  <div class="data-con">
    <div class="item-con no-border">
      <label class="label-block">选择数据源</label>
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
    <template v-if="dsType == 'device'"> </template>
  </div>
</template>
<script>
export default {
  name: "Datasource",
  data() {
    return {
      dsList: [
        { label: "设备", value: "device" },
        { label: "自定义数据源", value: "custom" }
      ],
      dsType: "device"
    }
  }
}
</script>
<style lang="less" scoped>
.data-con {
}
</style>

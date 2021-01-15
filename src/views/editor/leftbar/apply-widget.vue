<template>
  <div class="widget-con">
    <div class="header">
      <span>组件</span>
      <a-icon type="search" class="icon" @click="search" />
    </div>
    <div class="lib-con">
      <a-select size="small" v-model="libType" class="select">
        <a-select-option
          :value="item.value"
          v-for="item in libs"
          :key="item.value"
        >
          {{ item.label }}
        </a-select-option>
      </a-select>
    </div>
    <a-collapse v-model="activeKey" expand-icon-position="right">
      <a-collapse-panel
        :header="item.name"
        v-for="item in widgets"
        :key="item.value"
      >
        <div
          class="widget-item"
          v-for="w in item.list"
          :key="w.name"
          @dragstart="dragstart($event, w)"
        >
          <div class="icon-con" draggable="true">
            <svg-icon :icon-class="w.icon" class-name="icon" />
          </div>
          <span> {{ w.name }} </span>
        </div>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>
<script>
import config from "@/config"
export default {
  name: "ApplyWidget",
  data() {
    return {
      libs: [{ label: "默认组件库", value: "default" }],
      libType: "default",
      activeKey: ["basic"],
      widgets: config.widgets
    }
  },
  methods: {
    search() {},
    dragstart(evt, item) {
      const { x, y, srcElement } = evt // 开始拖拽时候，鼠标的位置
      const { left, top } = srcElement.getBoundingClientRect() // 拖拽元素与html文档的距离
      let dx = x - left
      let dy = y - top
      evt.dataTransfer.setData("item", JSON.stringify({ ...item, dx, dy }))
    }
  }
}
</script>
<style lang="less">
.widget-con {
  height: calc(100vh - 50px);
  .header {
    display: flex;
    justify-content: space-between;
    font-weight: 500;
    align-items: center;
    padding: 9px 10px;
    border-bottom: solid 1px #e5e6e9;
    color: #040c2c;
    .icon {
      font-size: 12px;
      cursor: pointer;
    }
  }
  .lib-con {
    padding: 9px 10px;
    border-bottom: solid 1px #e5e6e9;
    .select {
      width: 100%;
      color: #040c2c;
    }
  }
  .ant-collapse {
    border: none;
    color: #040c2c;
    .ant-collapse-header {
      padding: 9px 10px;
      background: #fff;
    }
    .ant-collapse-content {
      background: #f7f7f8;
      padding: 10px 0 0;
    }
    .ant-collapse-content-box {
      padding: 0;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
    }
  }
  .widget-item {
    width: 50px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #040c2c;
    font-size: 12px;
    margin-bottom: 10px;
    .icon-con {
      display: flex;
      width: 36px;
      height: 36px;
      justify-content: center;
      align-items: center;
      cursor: move;
      &:hover {
        background: #e5e6e9;
      }
    }
    .icon {
      height: 20px;
      font-size: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>

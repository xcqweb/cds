<template>
  <!--基本操作-->
  <a-menu slot="overlay">
    <a-menu-item class="fs">
      <span>网格</span>
      <a-checkbox
        v-model="showGrid"
        @change="e => onChange(e, 'grid')"
      ></a-checkbox>
    </a-menu-item>
    <a-menu-item class="fs">
      <span>标尺</span>
      <a-checkbox v-model="showRuler" @change="e => onChange(e, 'rules')">
      </a-checkbox>
    </a-menu-item>
  </a-menu>
</template>

<script>
export default {
  name: "AdjustPotion",
  data() {
    return {
      showRuler: true,
      showGrid: true
    }
  },
  methods: {
    onChange(e, type) {
      if (type === "rules") {
        this.showRuler = e.target.checked
        this.$store.commit("setRuler", { showRuler: e.target.checked })
      } else {
        this.showGrid = e.target.checked
        this.$store.commit("setGrid", { showRuler: e.target.checked })
      }
    }
  }
}
</script>

<style scoped>
.fs {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.ant-menu-vertical > .ant-menu-item {
  height: 28px;
  line-height: 28px;
  width: 83px;
  padding: 0 6px;
}
.ant-menu-vertical > .ant-menu-item:active,
.ant-menu-vertical > .ant-menu-item:hover {
  background: #f0f1f3;
}
.ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected {
  background-color: #f0f1f3;
}
.ant-menu-vertical .ant-menu-item:not(:last-child) {
  margin-bottom: 0px;
}
.ant-menu-item {
  white-space: unset;
}
.side-nav-icon {
  width: 1em;
  height: 1em;
}
</style>

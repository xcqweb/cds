<template>
  <div id="app">
    <a-config-provider :locale="locale">
      <router-view />
    </a-config-provider>
  </div>
</template>

<script>
import zhCN from "ant-design-vue/es/locale/zh_CN"
export default {
  data() {
    return {
      locale: zhCN,
      appId: ""
    }
  },
  created() {},
  methods: {}
}
</script>
<style lang="less">
#app {
  font-family: PingFangSC-Regular, PingFang SC, Avenir, Helvetica, Arial,
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  font-size: 12px;
  color: #040c2c;
}
</style>

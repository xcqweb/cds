<template>
  <div id="app">
    <a-config-provider :locale="locale">
      <router-view />
    </a-config-provider>
  </div>
</template>

<script>
import zhCN from "ant-design-vue/es/locale/zh_CN"
import api from "@a/apply"
export default {
  data() {
    return {
      locale: zhCN
    }
  },
  created() {
    //this.addApply()
    this.queryApply()
  },
  methods: {
    addApply() {
      const params = {
        "appType": 0,
        "classifyId": "",
        "descript": "test",
        "height": "768",
        "picUrl": "",
        "scale": "1",
        "studioName": "测试应用",
        "tenantId": "",
        "theme": "",
        "width": "1024"
      }
      api.add(params).then(res=>{
        if(res.code === 0) {
          this.$message.success('新建应用成功')
        }
      })
    },
    queryApply() {
      this.$store.dispatch('initApply','d82692156aab552c3ac1ce0fe51ae38c')
    }
  },
}
</script>
<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  font-size: 12px;
}
</style>

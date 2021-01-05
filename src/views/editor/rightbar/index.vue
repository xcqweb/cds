<template>
  <div class="right-con ge-mt">
      <a-tabs @change="callback">
        <a-tab-pane key="1" tab="交互">
<!--          <basicStyle></basicStyle>-->
                     <Page />
        </a-tab-pane>
        <a-tab-pane key="2" tab="样式" force-render>
          <mutual></mutual>
        </a-tab-pane>
      </a-tabs>
  </div>
</template>

<script>
import Page from "./page.vue"
import basicStyle from "./basicStyle"
import mutual from "./mutual"

export default {
  components: {
    Page,
    mutual,
    basicStyle
  },
  methods: {
    callback(key) {
      console.log(key);
    },
  },
}
</script>
<style lang="less">
.right-con {
  position: relative;
  width: 230px;
  display: flex;
  box-shadow: rgba(39, 54, 78, 0.11) 0px -2px 10px 0px;
  z-index: 4;
}
.ge-mt {
  padding: 10px;
}
</style>

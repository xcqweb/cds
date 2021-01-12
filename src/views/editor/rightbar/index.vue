<template>
  <div class="right-con ge-mt">
    <a-tabs @change="callback">
      <a-tab-pane key="1" tab="交互">
        <!-- <Page />        -->
        <Mutual v-if="activeId == 1" />
      </a-tab-pane>
      <a-tab-pane key="2" tab="样式" force-render>
        <Style v-if="activeId == 2" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
// import Page from "./page.vue"
import Style from "./style"
import Mutual from "./mutual"

export default {
  components: {
    // Page,
    Mutual,
    Style
  },
  data() {
    return {
      activeId: 1
    }
  },
  methods: {
    callback(key) {
      console.log(key)
      this.activeId = key
    }
  }
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

<template>
  <div class="right-con">
    <a-tabs @change="callback" style="width:100%;overflow: auto;">
      <a-tab-pane key="1" tab="交互">
        <!--        <Page />-->
        <Style v-if="activeId == 1" />
        <!-- <Mutual v-if="activeId == 1" /> -->
      </a-tab-pane>
      <a-tab-pane key="2" tab="样式" force-render>
        <Style v-if="activeId == 2" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
import Page from "./page.vue"
import Style from "./style"
// import Mutual from "./mutual"

export default {
  components: {
    Page,
    // Mutual,
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
  z-index: 4;
  box-shadow: 0px 2px 7px 0px rgba(0, 9, 43, 0.09);
  background-color: #ffffff;
}
.ge-mt {
  padding: 10px;
}
</style>

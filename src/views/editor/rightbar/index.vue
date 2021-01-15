<template>
  <div class="right-con">
    <page-style v-if="isPage"/>
    <a-tabs v-else size="small">
      <a-tab-pane key="style" tab="样式">
        <widget-style  />
      </a-tab-pane>
      <a-tab-pane key="mutual" tab="交互">
        <mutual />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
import PageStyle from "./page.vue"
import WidgetStyle from "./style"
import Mutual from "./mutual"

export default {
  components: {
    PageStyle,
    WidgetStyle,
    Mutual,
  },
  computed:{
    isPage() {
      return this.$store.getters.selectWidgets.length == 0
    }
  },
  data() {
    return {
    }
  },
  methods: {
     
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

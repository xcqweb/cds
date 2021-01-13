<template>
  <div class="left-con">
    <a-tabs default-active-key="page" tabPosition="left">
      <a-tab-pane key="page" tab="Tab 1">
        Content of Tab Pane 1
      </a-tab-pane>
      <a-tab-pane key="2" tab="Tab 2">
        Content of Tab Pane 2
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import SideNav from "./side-nav"
import SideMain from './side-main'
export default {
  components:{
    SideNav,
    SideMain,
  },
  data() {
    return {}
  },
  created() {},
  methods: {
    
  }
}
</script>

<style lang="less">
.left-con {
  width: 249px;
  box-sizing: content-box;
  position: relative;
  display: flex;
  background: rgb(255, 255, 255);
  border-right: 1px solid rgb(219, 219, 219);
  z-index: 4;
}
</style>

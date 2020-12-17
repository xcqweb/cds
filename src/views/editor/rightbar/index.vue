<template>
  <div class="right-con">
    <page />
  </div>
</template>

<script>
import Page from './page.vue'
export default {
  components:{
    Page
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
</style>

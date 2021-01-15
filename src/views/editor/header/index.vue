<template>
    <Toolbar></Toolbar>
</template>

<script>
import Toolbar from "./tools"
export default {
  components:{
    Toolbar,
  }
}
</script>
<style lang="less">
.ge-colorw {
  background: #ffffff;
}
.ge-colorg {
  background: #f3f0f0;
}
.toolbar-con {
  position: relative;
  height: 50px;
  border-bottom: 1px solid #e5e6e9;
  background: #fff;
  display: flex;
  -webkit-box-pack: justify;
  justify-content: space-between;
  -webkit-box-align: center;
  align-items: center;
  z-index: 107;
}
</style>

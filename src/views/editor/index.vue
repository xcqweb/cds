<template>
  <div class="app-con">
    <toolbar />
    <div class="main-con">
      <leftbar />
      <editor-main />
      <sub-content />
      <rightbar />
    </div>
  </div>
</template>

<script>
import EditorMain from "./main/index.vue"
import Toolbar from "./header"
import Leftbar from "./leftbar"
import Rightbar from "./rightbar"
import SubContent from "./sub"
export default {
  name: "EditorIndex",
  components: {
    EditorMain,
    Toolbar,
    Leftbar,
    Rightbar,
    SubContent
  },
  data() {
    return {}
  }
}
</script>
<style lang="less">
.app-con {
  position: absolute;
  top: 0px;
  left: 0px;
  bottom: 0px;
  right: 0px;
  transition: all 0.2s ease-in-out 0s;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  color: rgb(91, 107, 115);
  .main-con {
    position: relative;
    flex: 1 1 0%;
    display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
    overflow: hidden;
  }
}
</style>

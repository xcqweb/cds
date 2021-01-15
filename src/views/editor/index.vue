<template>
  <div class="app-con">
    <toolbar />
    <div class="main-con">
      <leftbar />
      <editor-main v-if="isInit" />
      <Loading v-else />
      <sub-content />
      <rightbar />
    </div>
  </div>
</template>

<script>
import EditorMain from "./main/index.vue"
import Toolbar from "./toolbar"
import Leftbar from "./leftbar"
import Rightbar from "./rightbar"
import SubContent from "./sub"
import Loading from "@c/loading"
import undoManager from "@u/undo-manager"
export default {
  name: "EditorIndex",
  components: {
    EditorMain,
    Toolbar,
    Leftbar,
    Rightbar,
    SubContent,
    Loading
  },
  data() {
    return {
      isInit: false
    }
  },
  created() {
    const applyId = this.$route.query.appId
    this.$store.dispatch("initApply", applyId).then(() => {
      this.isInit = true
      undoManager.saveApplyChange()
    })
    this.saveTimer = setTimeout(() => {
      this.$store.dispatch("patchModifyWidgets")
    },1000*60*2)// 2min
  },
  beforeDestroy() {
    clearTimeout(this.saveTimer)
    this.saveTimer = null
  },
  methods: {}
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


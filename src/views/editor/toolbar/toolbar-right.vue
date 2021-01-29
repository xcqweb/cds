<template>
  <div class="toolbar-right">
    <a class="right-item" @click.prevent="save">
      <svg-icon icon-class="save" class-name="icon" />
      <span>保存</span>
    </a>
    <a class="right-item" @click.prevent="run">
      <svg-icon icon-class="run" class-name="icon" />
      <span>运行</span>
    </a>
  </div>
</template>
<script>
export default {
  name: "ToolbarRight",
  data() {
    return {}
  },
  methods: {
    save() {
      this.$store.dispatch("patchModifyWidgets")
    },
    run() {
      this.$store.dispatch("patchModifyWidgets")
      const url = this.$router.resolve({
        path: "/preview-app",
        query: { applyId: this.$store.state.apply.id }
      })
      window.open(url.href, "_blank")
    }
  }
}
</script>
<style lang="less">
.toolbar-right {
  flex-basis: 230px;
  display: flex;
  width: 230px;
  height: 100%;
  justify-content: flex-end;
  .right-item {
    position: relative;
    border-top: 2px solid transparent;
    height: 100%;
    width: 44px;
    color: rgb(91, 107, 115);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-right: 20px;
    .icon {
      font-size: 16px;
    }
    span {
      color: #040c2c;
      border-top: 2px solid transparent;
    }
  }
}
</style>

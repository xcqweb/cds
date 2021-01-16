<template>
  <div class="toolbar-left">
    <a class="back-icon" @click="goBack">
      <svg-icon icon-class="arrow-back" />
    </a>
    <div class="text">
      {{ applyName }}
    </div>
  </div>
</template>
<script>
export default {
  name: "ToolbarLeft",
  computed: {
    applyName() {
      return this.$store.state.apply.studioName
    }
  },
  data() {
    return {}
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="less">
.toolbar-left {
  flex: 0 0 248px;
  padding-right: 10px;
  display: flex;
  align-items: center;
  height: 100%;
  .back-icon {
    display: flex;
    width: 44px;
    height: 100%;
    justify-content: center;
    align-items: center;
    margin-right: 7px;
    color: rgb(141, 158, 167);
    font-size: 16px;
    cursor: pointer;
    transition: all 0.1s linear 0s;
  }
  .text {
    font-size: 14px;
    max-width: 155px;
    min-width: 55px;
    color: rgb(82, 94, 113);
    cursor: text;
    display: flex;
    align-items: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
    height: 100%;
  }
}
</style>

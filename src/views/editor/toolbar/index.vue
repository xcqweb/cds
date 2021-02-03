<template>
  <div class="toolbar-con">
    <toolbar-left />
    <toolbar-center />
    <toolbar-right />
  </div>
</template>

<script>
import ToolbarLeft from "./toolbar-left"
import ToolbarCenter from "./toolbar-center"
import ToolbarRight from "./toolbar-right"
export default {
  name: "Toolbar",
  components: {
    ToolbarLeft,
    ToolbarCenter,
    ToolbarRight
  }
}
</script>
<style lang="less">
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
  box-shadow: 2px -2px 7px 0px rgba(0, 9, 43, 0.09);
  z-index: 107;
  a {
    &:hover {
      color: rgb(91, 107, 115);
      background: rgb(242, 242, 242);
    }
    &.disabled {
      position: relative;
      pointer-events: none;
      color: rgb(200, 205, 208);
      span {
        color: rgb(200, 205, 208);
      }
    }
  }
  .center-item {
    position: relative;
    height: 100%;
    width: 44px;
    color: rgb(91, 107, 115);
    border-top: 2px solid transparent;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .icon {
      font-size: 16px;
    }
    span {
      color: #040c2c;
      border-top: 2px solid transparent;
    }
    .ant-dropdown-trigger {
      text-align: center;
    }
    &.room-item {
      width: 68px;
      margin-left: 15px;
    }
  }
}
</style>

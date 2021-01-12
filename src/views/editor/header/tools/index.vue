<template>
  <div class="toolbar-con ge-colorw">
    <div class="tools">
      <div class="left"><a-icon type="left" />返回</div>
      <div class="sub">
        <div class="geToolbar">
          <!-- 撤销-重做 -->
          <div class="center-main">
            <div class="ge-pa10">
              <span class="ge-text">
                <a-icon type="left" />
              </span>
              <span style="display:block">撤销</span>
            </div>
            <div class="ge-pa10">
              <span class="ge-text">
                <a-icon type="left" />
              </span>
              <span style="display:block">重做</span>
            </div>
          </div>
        </div>
        <!-- 基本操作；对齐等 -->
        <div class="geToolbar">
          <div class="center-main">
            <div class="ge-pa10">
              <a-dropdown>
                <a class="ant-dropdown-link" @click="e => e.preventDefault()">
                  <span class="ge-text">
                    <a-icon type="left" />
                  </span>
                  <span style="display:block">
                    对齐
                  </span>
                </a>
                <a-menu slot="overlay">
                  <adjust-position></adjust-position>
                </a-menu>
              </a-dropdown>
            </div>
            <div class="ge-pa10">
              <span style="display:block">
                <a-icon type="left" />
              </span>
              <span style="display:block">置顶</span>
            </div>
            <div class="ge-pa10">
              <span style="display:block">
                <a-icon type="left" />
              </span>
              <span style="display:block">置底</span>
            </div>
            <div class="ge-pa10">
              <span style="display:block">
                <a-icon type="left" />
              </span>
              <span style="display:block">组合</span>
            </div>
            <div class="ge-pa10">
              <span style="display:block">
                <a-icon type="left" />
              </span>
              <span style="display:block">解散</span>
            </div>
          </div>
        </div>
        <div>
          <span>自动保存</span>
          <span>{{ time }}</span>
        </div>
      </div>
      <div class="right">
        <div class="geToolbar">
          <!-- 撤销-重做 -->
          <div class="center-main">
            <div class="ge-pa10" @click="save">
              <span class="ge-text">
                <a-icon type="left" />
              </span>
              <span style="display:block">保存</span>
            </div>
            <div class="ge-pa10">
              <span class="ge-text">
                <a-icon type="left" />
              </span>
              <span style="display:block">运行</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import adjustPosition from "../adjust-position"
import { currentTime } from "@/utils/time"
export default {
  components: {
    adjustPosition
  },
  data() {
    return {
      time: ""
    }
  },
  created() {
    this.time = currentTime(new Date(), "time")
  },
  methods: {
    save() {
      this.time = currentTime(new Date(), "time")
    }
  }
}
</script>
<style lang="less" scoped>
.tools {
  flex: 1 1 0%;
  display: flex;
  justify-content: space-between;
  font-size: 18px;
  height: 54px;
  .left {
    width: 280px;
    padding-left: 20px;
    height: 54px;
    line-height: 54px;
  }
  .sub {
    flex: 1 1 0%;
    display: flex;
    min-width: 400px;
    font-size: 14px;
    justify-content: space-between;
    align-items: center;
  }
  .right {
    width: 230px;
    margin-left: 30px;
    font-size: 14px;
  }
  .geToolbar {
    box-sizing: border-box;
    flex: 1 1 auto;
  }
  .center-main {
    display: flex;
    align-items: center;
  }
  .ge-pa10 {
    padding: 6px;
    margin-right: 20px;
    cursor: pointer;
  }
  .ge-text {
    text-align: center;
    display: block;
  }
  .ge-pa10:active,
  .ge-pa10:hover,
  .ge-pa10:focus {
    color: #1890ff;
  }
}
</style>

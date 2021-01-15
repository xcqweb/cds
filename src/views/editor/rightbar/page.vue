<template>
  <div class="ge-mt6 page">
    <!--字号，颜色-->
    <div class="fs ge-h50 ge-border">
      <label>页面尺寸</label>
      <div class="pdr10">
        <a-select
          :value="pageSize"
          :not-found-content="null"
          :show-arrow="true"
          @change="handleChange"
        >
          <a-select-option v-for="item in list" :key="item">
            {{ item }}</a-select-option
          >
        </a-select>
      </div>
    </div>

    <div class="fs ge-h50 ge-border">
      <!--边框颜色-->
      <label>背景颜色</label>
      <div class="ge-pr pdr10">
        <div
          @click="toggle2"
          class="ge-block "
          :style="{ background: backgroundValue }"
        ></div>
        <color-picker
          v-if="visiablecolor2"
          class="ge-pos1 ge-zindex"
          @colorChange="colorChange1"
        />
      </div>
    </div>

    <div class="ge-border">
      <div class="fs ge-h50" style="height:112px">
        <!--背景图片-->
        <label>背景图片</label>
        <div
          class="ge-w60 ge-pr bg"
        >
          <upload-image @addImage="addImage" :styleObj="styleObj">
            <div>
              <div class="fc">
                <div style="width:36px;height:36px;border:1px dashed">
                  <svg-icon icon-class="default" class-name="side-nav-icon" />
                </div>
              </div>
              <div style="margin-top:5px">
                <span>选择背景图片</span>
              </div>
            </div>
          </upload-image>
        </div>
      </div>
    </div>

    <div class="ge-border">
      <div>
        <div class="fs ge-h50">
          <label>导航布局</label>
        </div>
        <div
          class="fs ge-w60 ge-pr pal10 pdr10"
          style=" width:100%;height:65px;"
        >
          <div class="chose-nav">
            <div class="nav"></div>
            <div class="textc mt5">
              <label>无</label>
            </div>
          </div>
          <div class="chose-nav">
              <div class="nav ge-pr" >
                <div class="nav-bar-left"></div>
              </div>
            <div class="textc mt5">
              <label>左侧导航</label>
            </div>
          </div>
          <div class="chose-nav">
            <div class="nav ge-pr" >
              <div class="nav-bar-top"></div>
            </div>
            <div class="textc mt5">
              <label>顶部导航</label>
            </div>
          </div>
        </div>
      </div>
      <div class="fs ge-h50 ge-border">
        <!--边框颜色-->
        <label>导航风格</label>
        <div class="ge-pr pdr10">
          <div
            @click="toggle1"
            class="ge-block "
            :style="{ background: backgroundValue }"
          ></div>
          <color-picker
            v-if="visiablecolor1"
            class="ge-pos1 ge-zindex"
            @colorChange="colorChange1"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ColorPicker from "@c/color-picker/index"
import uploadImage from "@c/upload"

import helpMethods from "@/mixins/help-methods"
import config from "@/config"
let imgUrl = require("./logo.png")
export default {
  components: {
    ColorPicker,
    uploadImage
  },
  mixins: [helpMethods],
  data() {
    return {
      list: ["1366 * 768", "1280 * 768", "1920 * 1080"],
      pageSize: "1366 * 768",
      backgroundValue: "#000",
      backgroundValue1: "#000",
      visiablecolor1: false,
      visiablecolor2: false,
      isiablecolor: false,
      src: imgUrl,
      styleObj: {
        width: "100%",
        height: "100%",
        position: "relative"
      }
    }
  },
  created() {},
  methods: {
    addImage(imgFile) {
      //base的图片路径
      console.log(imgFile)
      this.src = imgFile
    },
    onChange(checked) {
      console.log(`a-switch to ${checked}`)
    },
    handleChange(value) {
      this.textStyle.fontSize.sort()
      if (this.textStyle.fontSize.indexOf(value) == -1) {
        this.textStyle.fontSize.unshift(value)
        this.textStyle.fontSize.sort()
      }
    },
    colorChange(color) {
      this.$store.commit("setGridColor", color)
      this.backgroundValue = color
    },
    colorChange1(color) {
      this.$store.commit("setGridColor", color)
      this.backgroundValue = color
    },
    toggle1() {
      this.visiablecolor1 = true
    },
    toggle2() {
      this.visiablecolor2 = true
    },

    sizeChange(size) {
      this.$store.commit("setGrid", { size })
      undoManager.saveApplyChange()
    }
  }
}
</script>
<style lang="less" scoped>
.page {
  font-size: 12px;
  .fs {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .fc {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .ge-h50 {
    height: 50px;
  }
  label {
    width: 48px;
    height: 18px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #040C2C;
    line-height: 18px;
    margin-left: 10px;
  }
  .pdr10 {
    padding-right: 10px;
  }
  .pal10 {
    padding-left: 10px;
  }
  .ant-select {
    width: 142px;
  }
  .ge-border {
    border-bottom: 1px solid #e5e6e9;
  }
  .ge-w60 {
    width: 60px;
  }
  .ge-color1 {
    background-color: #fcfcfc;
  }
  .ge-pr {
    position: relative;
  }
  .ge-pos {
    position: absolute;
    top: 0;
    right: 240px;
  }
  .textc {
    text-align: center;
  }
  .ge-pos1 {
    position: absolute;
    top: 0;
    right: 90px;
  }
  .active {
    background-color: #277ae0;
  }
  .ge-block {
    height: 30px;
    width: 73px;
    border-radius: 2px;
    cursor: pointer;
    border: 1px solid #d4d4d4;
  }
  .side-nav-icon {
    width: 2.8em;
    height: 3em;
    color: #c3cbce;
  }
  .nav{
    width: 63px;
    height: 42px;
    background: #FFFFFF;
    border-radius: 2px;
    border: 1px solid #CDCED5;
  }
  .mt5{
    margin-top: 5px;
  }
  .chose-nav{
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
  }
  .chose-nav:active,
  .chose-nav:hover,
  .chose-nav:focus{
    cursor: pointer;
    .nav{
      border: 1px solid #1740DC;
    }
    label{
      color: #1740DC;
    }
  }
  .bg{
    width: 138px;
    height: 89px;
    background: #F7F7F8;
    border-radius: 2px;
    margin-right: 10px;
  }
  .nav-bar-top{
    width: 61px;
    height: 9px;
    background: #1740DC;
    border-radius: 1px 1px 0px 0px;
    opacity: 0.6;
  }
  .nav-bar-left{
    position: absolute;
    top:0;
    left:0px;
    width: 10px;
    height: 40px;
    background: #1740DC;
    border-radius: 1px 0px 0px 1px;
    opacity: 0.6;
  }
  .ge-zindex {
    z-index: 1;
  }
}
</style>

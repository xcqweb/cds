<template>
  <div class="name-posititon">
    <div class="ge-border">
      <div class="pdl10">
        <a-input class="ge-input30" :value="left" @change="setLeft" suffix="X"/>
        <a-input class="ge-input30" :value="left" @change="setLeft" suffix="Y"/>
        <a-input class="ge-input30 pdr10" :value="top" @change="setTop" suffix="。"/>
      </div>
      <div class="pdl10">
        <a-input class="ge-input30" :value="width" @change="setWidth" suffix="W"/>
        <a-input class="ge-input30" :value="height" @change="setHeight" suffix="H"/>
        <a-input class="ge-input30 pdr10" :value="height" @change="setHeight" suffix="H"/>
      </div>
    </div>

    <div class="ge-border">
      <div class="fs pdt6 pdr10">
        <label>组件名称</label>
        <a-input :value="name" @change="setName" placeholder="Basic usage" />
      </div>

      <div class="fs pdt6 pdr10">
        <label>是否隐藏</label>
        <a-switch v-model="checked" @change="onChange" />
      </div>

      <div class="fs pdt6 pdr10">
        <label>不透明度</label>
        <div class="fc">
          <a-slider v-model="inputValue1" :min="1" :max="100" />
          <a-input-number v-model="inputValue1" :min="1" :max="100" style="marginLeft: 16px" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import helpComputed from "@/mixins/help-computed"
export default {
  name: "name-position",
  mixins: [helpComputed],
  data() {
    return {
      checked:false,
      inputValue1:1,
    }
  },
  computed: {
    name() {
      return this.currentWidget === null ||
        this.currentWidgetIndex === -1
        ? ""
        : this.$store.state.apply.pages[this.currentPageIndex].widgets[
            this.currentWidgetIndex
          ].name
    },
    width() {
      return this.currentWidget === null ||
        this.currentWidgetIndex === -1
        ? ""
        : this.$store.state.apply.pages[this.currentPageIndex].widgets[
            this.currentWidgetIndex
          ].attrs.width
    },
    height() {
      return this.currentWidget === null ||
        this.currentWidgetIndex === -1
        ? ""
        : this.$store.state.apply.pages[this.currentPageIndex].widgets[
            this.currentWidgetIndex
          ].attrs.height
    },
    top() {
      return this.currentWidget === null ||
        this.currentWidgetIndex === -1
        ? ""
        : this.$store.state.apply.pages[this.currentPageIndex].widgets[
            this.currentWidgetIndex
          ].attrs.top
    },
    left() {
      return this.currentWidget === null ||
        this.currentWidgetIndex === -1
        ? ""
        : this.$store.state.apply.pages[this.currentPageIndex].widgets[
            this.currentWidgetIndex
          ].attrs.left
    }
  },
  methods: {
    setName(ev) {
      let value = ev.target.value
      if (value) {
        ev.target.value = value
        this.$store.commit("setName", value)
      }
    },
    setLeft(ev) {
      let value = parseInt(ev.target.value)
      if (typeof value !== "number" || isNaN(value)) {
        value = this.$store.state.apply.pages[this.currentPageIndex].widgets[
          this.currentWidgetIndex
        ].attrs.left
        ev.target.value = value
      }
      this.$store.commit("setLeft", value)
    },
    setTop(ev) {
      let value = parseInt(ev.target.value)
      if (typeof value !== "number" || isNaN(value)) {
        value = this.$store.state.apply.pages[this.currentPageIndex].widgets[
          this.currentWidgetIndex
        ].attrs.top
        ev.target.value = value
      }
      this.$store.commit("setTop", value)
    },
    setWidth(ev) {
      let value = parseInt(ev.target.value)
      if (typeof value !== "number" || isNaN(value)) {
        value = this.$store.state.apply.pages[this.currentPageIndex].widgets[
          this.currentWidgetIndex
        ].attrs.width
        ev.target.value = value
      }
      this.$store.commit("setWidth", value)
    },
    setHeight(ev) {
      let value = parseInt(ev.target.value)
      if (typeof value !== "number" || isNaN(value)) {
        value = this.$store.state.apply.pages[this.currentPageIndex].widgets[
          this.currentWidgetIndex
        ].attrs.height
        ev.target.value = value
      }
    },
    onChange(checked) {
      // this.checked = !checked
    }

  }
}
</script>
<style>
@import '../index.less'
</style>
<style lang="less">
.name-posititon{
  font-size: 12px;

.ge-input30{
  width: 63px;
  height: 30px;
  margin-bottom: 10px;
  .ant-input-affix-wrapper .ant-input:not(:last-child) {
    padding-right: 24px;
  }
  .ant-input {
    width: 63px;
    height: 30px;
    background: #F7F7F8;
    border-radius: 2px;
    border: 1px solid #F0F1F3;
    box-sizing: border-box;
    padding: 2px 3px;
  }
}
.pdt6{
  .ge-input22{
    width: 42px;
    .ant-input{
      width: 42px;
      height: 22px;
      background: #F7F7F8;
      border-radius: 2px;
      border: 1px solid #F0F1F3;
      box-sizing: border-box;
      padding: 0px 0px;

    }
  }
}

.ant-tabs .ant-tabs-top-content{
  width: 219px;
}
.ge-input30:not(:nth-of-type(3)){
  margin-right: 10px;
}
.ge-h40 {
  height: 40px;
  line-height: 40px;

}
label {
  width: 48px;
  height: 35px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #040C2C;
  line-height: 35px;
  margin-left: 10px;
}
.ant-input{
  width: 142px;
}
.ant-switch{
  width: 30px;
  height: 16px;
  min-width: 33px;
}
.ant-switch-loading-icon, .ant-switch::after{
  width: 13px;
  height: 13px;
}
.ant-input-affix-wrapper .ant-input-prefix, .ant-input-affix-wrapper .ant-input-suffix {
  color: #040C2C;
}
.ant-slider{
  width: 76px;
}
.ant-input-number{
  width: 42px;
  height: 22px;
}
.ant-input-number-handler-wrap{
  display: none;
  width: 10px
}
.ant-input-number-input{
  height: 22px;
  padding: 0 6px;
}
.ant-slider-track {
  background: #1740DC;
  border-radius: 2px;
}
.ant-slider-handle {
  position: absolute;
  margin-top: -1.8px;
  cursor: pointer;
  width: 6px;
  height: 6px;
  background: #1740DC;
  box-shadow: 0px 0px 5px 0px rgba(21, 60, 209, 0.19);
  border: 1px solid #FFFFFF;

  transition: border-color 0.3s, box-shadow 0.6s, transform 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
}
}
</style>

<template>
  <div class="text-style-con" v-if="show">
    <div class="item-con">
      <label class="label-block">文字样式</label>
      <a-select
        v-model="fontFamilyModel"
        size="small"
        style="width:100%;"
        class="style-con"
      >
        <a-select-option
          v-for="item in fontFamilyList"
          :key="item.value"
          :value="item.value"
        >
          {{ item.label }}
        </a-select-option>
      </a-select>
      <div class="fs style-con">
        <a-input
          size="small"
          v-model="fontSizeModel"
          type="number"
          style="width:30%;"
        />
        <div
          class="bold fc"
          :class="{ 'select': fontWeightModel }"
          @click="changeFontBold(fontWeightModel)"
        >
          B
        </div>
        <div
          class="font-color"
          :style="{ 'backgroundColor': colorModel }"
          @click="showColorPicker('fontColor', $event)"
        />
      </div>
      <div class="fs style-con">
        <div class="font-align-item">
          <div
            class="font-align-wrap fc"
            :class="{ select: attrs.justifyContent === 'flex-start' }"
            @click="changeAlign(1,'flex-start')"
          >
            <svg-icon icon-class="text-left" class-name="icon-font-align" />
          </div>
          <div
            class="font-align-wrap fc"
            :class="{ select: attrs.justifyContent === 'center' }"
            @click="changeAlign(1,'center')"
          >
            <svg-icon icon-class="text-center" class-name="icon-font-align" />
          </div>
          <div
            class="font-align-wrap fc"
            :class="{ select: attrs.justifyContent === 'flex-end' }"
            @click="changeAlign(1,'flex-end')"
          >
            <svg-icon icon-class="text-right" class-name="icon-font-align" />
          </div>
        </div>
        <div class="font-align-item">
          <div
            class="font-align-wrap fc"
            :class="{ select: attrs.alignItems === 'flex-start' }"
            @click="changeAlign(2,'flex-start')"
          >
            <svg-icon icon-class="text-top" class-name="icon-font-align" />
          </div>
          <div
            class="font-align-wrap fc"
            :class="{ select: attrs.alignItems === 'center' }"
            @click="changeAlign(2,'center')"
          >
            <svg-icon icon-class="text-middle" class-name="icon-font-align" />
          </div>
          <div
            class="font-align-wrap fc"
            :class="{ select: attrs.alignItems === 'flex-end' }"
            @click="changeAlign(2,'flex-end')"
          >
            <svg-icon icon-class="text-bottom" class-name="icon-font-align" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {findWidgetById} from '@u/deal'
const fontFamilyList = [
  { label: "苹方字体", value: "PingFangSC-Regular" },
  { label: "微软雅黑", value: "Microsoft YaHei" },
  { label: "黑体", value: "SimHei" },
  { label: "宋体 ", value: "SimSun" },
  { label: "楷体", value: "KaiTi" },
  { label: "仿宋", value: "FangSong" }
]
import helpComputed from "@/mixins/help-computed"
export default {
  name: "TextStyle",
  mixins: [helpComputed],
  computed: {
    show() {
      const widgetNames = ["GtImage", "GtLine", "GtLink"]
      return !widgetNames.includes(this.cname)
    },
    operateWidget() {
      if(this.selectWidgets.length) {
        return this.selectWidgets[0]
      }
      const textEditor = this.$store.state.textEditorShow
      if(textEditor.cid) {
        return findWidgetById(this.currentPage.widgets,textEditor.cid)
      }
      return null
    },
    fontFamilyModel:{
      get() {
        return this.operateWidget.attrs.fontFamily
      },
      set(fontFamily) {
        this.$store.commit("updateWidgetAttrs", { fontFamily })
      },
    },
    fontSizeModel:{
      get() {
        return this.operateWidget.attrs.fontSize
      },
      set(fontSize) {
        this.$store.commit("updateWidgetAttrs", { fontFamily })
      },
    },
    fontWeightModel () {
      return this.operateWidget.attrs.fontWeight
    },
    colorModel(){
      return this.operateWidget.attrs.color
    },
    justifyContentModel(){
      return this.operateWidget.attrs.justifyContent
    },
    alignItemsModel() {
      return this.operateWidget.attrs.alignItems
    },
  },
  data() {
    return {
      fontFamilyList,
    }
  },
  methods: {
    changeFontBold(val) {
      this.$store.commit("updateWidgetAttrs", { fontWeight:!val })
    },
    showColorPicker(type, evt) {
      this.$emit("showColorPicker", type, evt)
    },
    changeAlign(type,align) {
      const arr = ['justifyContent','alignItems']
      let res = {}
      res[arr[type - 1]] = align
      this.$store.commit("updateWidgetAttrs", {...res})
    },
  }
}
</script>
<style lang="less" scoped>
.text-style-con {
  .style-con {
    margin-bottom: 10px;
  }
  .bold {
    width: 30px;
    height: 30px;
    background: #ffffff;
    border-radius: 2px;
    border: 1px solid #f0f1f3;
    cursor: pointer;
    &.select {
      background: rgb(237, 237, 237);
      color: rgb(41, 141, 248);
      font-weight: 800;
    }
  }
  .font-color {
    width: 30%;
    height: 30px;
    border: solid 1px #bbbbbb;
    cursor: pointer;
  }
  .font-align-item {
    display: flex;
    border: 1px solid rgb(237, 237, 237);
    border-radius: 2px;
  }
  .font-align-wrap {
    flex: 1 1 0%;
    width: 100%;
    height: 100%;
    width: 30px;
    height: 26px;
    color: rgb(91, 107, 115);
    &.select {
      color: rgb(41, 141, 248);
      border-left: 1px solid rgb(237, 237, 237);
      border-right: 1px solid rgb(237, 237, 237);
      background: rgb(237, 237, 237);
      transition: transform 0.2s ease-in-out 0s;
    }
    &:hover {
      color: rgb(41, 141, 248);
    }
    .icon-font-align {
      cursor: pointer;
      color: currentColor;
    }
  }
}
</style>

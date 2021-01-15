<template>
  <div class="ge-border ge-mt6">
    <!--字号，颜色-->
    <div class="fs ge-h40">
      <a-select
        style="width: 60px"
        :disabled="getlistLoading"
        :value="fontSize"
        :show-search="true"
        :not-found-content="null"
        :show-arrow="false"
        :filter-option="true"
        :autoClearSearchValue="false"
        @search="handleSearch"
        @blur="handleBlur"
        @change="handleChange"
      >
        <a-select-option v-for="item in textStyle.fontSize" :key="item">
          {{ item }}</a-select-option
        >
      </a-select>
      <div
        class="ge-block ge-color1 fcm"
        :class="{ active: activeFlag }"
        @click="setBold"
      >
        B
      </div>
      <div class="ge-pr">
        <div
          @click="toggle"
          class="ge-block"
          :style="{ background: backgroundValue }"
        ></div>
        <color-picker
          v-if="visiablecolor"
          class="ge-pos ge-zindex"
          @colorChange="colorChange"
        />
      </div>
    </div>
    <!--对齐方式-->
    <div class="fs ge-h40">
      <div class="jXcSfj h-alignment" style="border: 1px solid #C1C2C5">
        <div
          class="radio-option"
          :class="{ active: posType == 'left' }"
          @click="setPosition('left')"
        >
          <div class="radio-content">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="svg-icon icon"
              viewBox="0 0 12 9"
              aria-hidden="true"
            >
              <path d="M0 9h5V8H0v1zm0-8h12V0H0v1zm0 4h8V4H0v1z"></path>
            </svg>
          </div>
        </div>
        <div
          class="radio-option"
          :class="{ active: posType == 'center' }"
          @click="setPosition('center')"
        >
          <div class="radio-content">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="svg-icon icon"
              viewBox="0 0 12 9"
              aria-hidden="true"
            >
              <path d="M3 0h6v1H3V0zm0 8h6v1H3V8zM0 4h12v1H0V4z"></path>
            </svg>
          </div>
        </div>
        <div
          class="radio-option"
          :class="{ active: posType == 'right' }"
          @click="setPosition('right')"
        >
          <div class="radio-content">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="svg-icon icon"
              :fill="fill"
              viewBox="0 0 12 9"
              aria-hidden="true"
            >
              <path d="M7 9h5V8H7v1zM0 1h12V0H0v1zm4 4h8V4H4v1z"></path>
            </svg>
          </div>
        </div>
      </div>

      <div class="jXcSfj h-alignment" style="border: 1px solid #C1C2C5">
        <div
          class="radio-option"
          :class="{ active: posType == 'top' }"
          @click="setPosition('top')"
        >
          <div class="radio-content">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="svg-icon icon"
              viewBox="0 0 12 9"
              aria-hidden="true"
            >
              <path d="M0 9h5V8H0v1zm0-8h12V0H0v1zm0 4h8V4H0v1z"></path>
            </svg>
          </div>
        </div>
        <div
          class="radio-option"
          :class="{ active: posType == 'middle' }"
          @click="setPosition('middle')"
        >
          <div class="radio-content">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="svg-icon icon"
              viewBox="0 0 12 9"
              aria-hidden="true"
            >
              <path d="M3 0h6v1H3V0zm0 8h6v1H3V8zM0 4h12v1H0V4z"></path>
            </svg>
          </div>
        </div>
        <div
          class="radio-option"
          :class="{ active: posType == 'bottom' }"
          @click="setPosition('bottom')"
        >
          <div class="radio-content">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="svg-icon icon"
              :fill="fill"
              viewBox="0 0 12 9"
              aria-hidden="true"
            >
              <path d="M7 9h5V8H7v1zM0 1h12V0H0v1zm4 4h8V4H4v1z"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
    <!--字体-->
    <div class="fs ge-h40">
      <a-select
        mode="default"
        v-model="fontFamily"
        style="width: 100%"
        placeholder="Please select"
        @change="setFontFamily"
      >
        <a-select-option
          v-for="item in textStyle.fontFamilyList"
          :key="item.value"
        >
          {{ item.label }}
        </a-select-option>
      </a-select>
    </div>
    <div>{{ pos.x }}</div>
  </div>
</template>

<script>
import ColorPicker from "@c/color-picker/index"
import helpComputed from "@/mixins/help-computed"

export default {
  name: "text-color",
  mixins: [helpComputed],
  components: {
    ColorPicker
  },
  props: {
    textStyle: {
      type: Object,
      default() {
        return {}
      }
    },
    pos: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    fontSize() {
      return this.currentWidget === null ||
        (Object.keys(this.currentWidget).length === 0 &&
          this.currentWidgetIndex === -1)
        ? 12
        : this.$store.state.apply.pages[this.currentPageIndex].widgets[
            this.currentWidgetIndex
          ].fontSize
    }
  },
  data() {
    return {
      getlistLoading: false, //获取到下拉列表的数据前默认改选择器不可用
      backgroundValue: "#000",
      visiablecolor: false,
      activeFlag: false,
      posType: "",
      fill: "277ae0",
      fontFamily: "Microsoft YaHei"
    }
  },
  watch: {},
  mounted() {},
  methods: {
    // 实现select选择框可下拉单选，也可输入赋值
    handleSearch(value) {
      this.handleChange(value)
    },
    handleChange(value) {
      this.textStyle.fontSize.sort()
      if (this.textStyle.fontSize.indexOf(value) == -1) {
        this.textStyle.fontSize.unshift(value)
        this.textStyle.fontSize.sort()
      }
    },
    handleBlur(ev) {
      console.log(ev)
      let value = parseInt(ev.target.value)
      if (typeof value !== "number" || isNaN(value)) {
        value = this.$store.state.apply.pages[this.currentPageIndex].widgets[
          this.currentWidgetIndex
        ].attrs.fontSize
        ev.target.value = value
      }
      this.$store.commit("updateWidgetAttrsPatch", { fontSize: value })
    },
    colorChange(color) {
      this.$store.commit("setGridColor", color)
      this.backgroundValue = color
    },
    hide() {
      this.visiablecolor = false
    },
    toggle() {
      this.visiablecolor = true
    },
    setBold() {
      this.activeFlag = !this.activeFlag
    },
    setPosition(type) {
      console.log(type)
      this.posType = type
    },
    setFontFamily(value) {
      console.log(value)
    }
  }
}
</script>

<style lang="less" scoped>
.fs {
  display: flex;
  justify-content: space-between;
}
.ge-h40 {
  height: 40px;
  line-height: 40px;
}
label {
  width: 80px;
  text-align: center;
}
.ge-border {
  border-bottom: 1px solid #323a3e;
}
.ge-mt6 {
  margin-top: 6px;
}
.ge-block {
  width: 60px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  border: 1px solid #d4d4d4;
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
.active {
  background-color: #277ae0;
}
.jXcSfj {
  display: flex;
  justify-content: center;
  height: 36px;
  align-items: center;
  color: rgb(91, 107, 115);
  text-align: center;
  background: rgb(255, 255, 255);
  border-radius: 2px;
  overflow: hidden;
  border-width: 1px;
  border-style: solid;
  border-color: rgb(237, 237, 237);
  border-image: initial;
}
.radio-option {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: pointer;
  flex: 1 1 0%;
  .radio-content {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }
}
.h-alignment {
  width: 100px;
}
.svg-icon {
  fill: #000;
  width: 1em;
}
.ge-pos1 {
  position: absolute;
  top: 0;
  right: 90px;
}
.ge-zindex {
  z-index: 1;
}
.fcm {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

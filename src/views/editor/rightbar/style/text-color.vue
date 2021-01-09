<template>
  <div class="ge-border ge-mt6">
    <!--字号，颜色-->
    <div>
      <label>填充</label>
      <div class="fs ge-h40">
        <div class="ge-pr ge-w100">
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
    </div>
    <div>
      <label>边框</label>
      <div class="fs ge-h40">
        <!--边框颜色-->
        <div class="ge-w60 ge-pr ">
          <div
            @click="toggle1"
            class="ge-block "
            :style="{ background: backgroundValue1 }"
          ></div>
          <color-picker
            v-if="visiablecolor1"
            class="ge-pos1 ge-zindex"
            @colorChange="colorChange1"
          />
        </div>
        <!--边框style-->
        <div class="stylePage">
          <div
            class="item-container fontSet"
            style="justify-content:space-between;position:relative;flex:1;"
            @click="showBorderLineChart = true"
          >
            <div :class="borderLineClsChart" />
            <img src="../../../../assets/images/icon/down_ic.png" />
            <ul
              v-if="showBorderLineChart"
              class="font-dialog"
              @mouseleave="showBorderLineChart = false"
              @keyup.enter="showBorderLineChart = false"
              @blur="showBorderLine = false"
            >
              <li
                v-for="(d, index) in borderLineListChart"
                :key="index"
                @click="changeChartBorderLine(d, $event)"
              >
                <div
                  style="width:100%;height:4px;display:inline-block;vertical-align:middle;"
                >
                  <div :class="d" />
                </div>
              </li>
            </ul>
          </div>
        </div>
        <!--边框大小-->
        <a-select
          class="ge-w60"
          :disabled="getlistLoading"
          v-model="value"
          :show-search="true"
          :not-found-content="null"
          :show-arrow="true"
          :filter-option="false"
          :autoClearSearchValue="false"
          @search="handleSearch"
          @blur="handleBlur"
          @change="handleChange"
        >
          <a-select-option v-for="item in textColor.borderWidth" :key="item">
            {{ item }}</a-select-option
          >
        </a-select>
      </div>
    </div>
  </div>
</template>

<script>
import ColorPicker from "@c/color-picker/index"

export default {
  name: "text-color",
  components: {
    ColorPicker
  },
  props: {
    textColor: {
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
  data() {
    return {
      value: "1", //选择下拉列表中选项后的值
      getlistLoading: false, //获取到下拉列表的数据前默认改选择器不可用
      backgroundValue: "#000",
      backgroundValue1: "#000",
      visiablecolor: false,
      visiablecolor1: false,
      activeFlag: false,
      showBorderLineChart: false,
      borderLineClsChart: "border-line",
      borderLineListChart: ["border-line", "border-dash"]
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
      this.value = value
      if (this.textColor.borderWidth.indexOf(value) == -1) {
        console.log(value)
        this.textColor.borderWidth.unshift(value)
      }
      // this.textColor.borderWidth.sort()
    },
    handleBlur(value) {
      this.value = value
    },
    colorChange(color) {
      this.$store.commit("setGridColor", color)
      this.backgroundValue = color
    },
    colorChange1(color) {
      this.$store.commit("setGridColor", color)
      this.backgroundValue = color
    },
    hide() {
      this.visiablecolor = false
    },
    toggle() {
      this.visiablecolor = true
    },
    hide1() {
      this.visiablecolor1 = false
    },
    toggle1() {
      this.visiablecolor1 = true
    },
    hideBorderLineChart() {
      this.showBorderLineChart = false
    },
    changeChartBorderLine(d, e) {
      this.borderLineClsChart = d
      this.showBorderLineChart = false
      e.stopPropagation()
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
.ge-w60 {
  width: 60px;
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
.ge-w100 {
  width: 100%;
}
.ge-block {
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
.ge-pos1 {
  position: absolute;
  top: 0;
  right: 90px;
}
.active {
  background-color: #277ae0;
}
.ge-borer {
  border-color: rgb(187, 187, 187);
  border-width: 1px;
}
.ge-dotted {
  border-style: dotted;
}
.ge-solid {
  border-style: solid;
}
.ge-dashed {
  border-style: dashed;
}
.stylePage {
  .item-container {
    width: 100%;
    height: 24px;
    display: flex;
    align-items: center;
    font-weight: 400;
    box-sizing: border-box;
    background-color: #fff;
    border: 1px solid #d9d9d9;
    border-top-width: 1.02px;
    border-radius: 4px;
    color: #252525;
  }
  .fontSet {
    padding-left: 6px;
    cursor: pointer;
    line-height: 32px;
    height: 30px;
  }
  .border-dash {
    border: 1px dashed #000;
    height: 1px;
    width: 40px;
  }
  .border-line {
    background: #000;
    height: 1px;
    box-sizing: border-box;
    width: 40px;
  }
  .font-dialog {
    position: absolute;
    left: 0;
    top: 24px;
    z-index: 22;
    background: #f5f5f5;
    width: 100%;
    border: 1px solid #ccc;
    box-shadow: 0 3px 8px 0 rgba(0, 0, 0, 0.2);
    opacity: 0.98;
    border-radius: 0 0 2px 2px;
  }
  ul li {
    list-style: none;
  }
  li {
    padding: 0px 6px;
  }
}
.ge-zindex {
  z-index: 1;
}
</style>

<template>
  <div class="line-style-con" v-if="cname == 'GtLine'">
    <div class="item-con fs">
      <label>箭头显示</label>
      <a-select v-model="attrs.arrow" size="small" style="width:60%;">
        <a-select-option
          v-for="(item, index) in arrowClsList"
          :key="index"
          :value="item"
        >
          <div :class="`right-con-line-style-${item}`" />
        </a-select-option>
      </a-select>
    </div>
  </div>
</template>
<script>
import helpComputed from "@/mixins/help-computed"
export default {
  name: "LineStyle",
  mixins: [helpComputed],
  data() {
    return {
      arrowClsList: ["empty", "left", "right", "double"],
      arrowCls: "empty"
    }
  },
  methods: {}
}
</script>
<style lang="less" scoped>
.line-style-con {
  /deep/.ant-select-selection-selected-value {
    width: 100%;
  }
}
</style>
<style>
.right-con-line-style-empty::after {
  content: "无";
}
.right-con-line-style-left {
  width: 100%;
  height: 18px;
  background: url("~@/assets/images/icon/arrow_letf.png") no-repeat center left;
  background-size: contain;
  cursor: pointer;
  pointer-events: auto;
}
.right-con-line-style-right {
  width: 100%;
  height: 18px;
  background: url("~@/assets/images/icon/arrow_right.png") no-repeat center left;
  background-size: contain;
  cursor: pointer;
  pointer-events: auto;
}
.right-con-line-style-double {
  width: 100%;
  height: 18px;
  background: url("~@/assets/images/icon/arrow_twoway.png") no-repeat center
    right;
  background-size: contain;
  cursor: pointer;
  pointer-events: auto;
}
</style>

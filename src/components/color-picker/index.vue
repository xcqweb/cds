<template>
  <div
    v-if="visible"
    :style="objStyle"
    class="color-picker-con"
    v-click-out-side="hide"
  >
    <header class="color-picker-header">
      <div class="header-text">颜色设置</div>
      <a-icon type="close" style="cursor:pointer;" @click.native="hide"/>
    </header>
    <sketch-picker v-model="color" @input="updateValue"></sketch-picker>
  </div>
</template>
<script>
import { Sketch } from "vue-color"
export default {
  name: "ColorPicker",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    objStyle: Object
  },
  components: {
    "sketch-picker": Sketch
  },
  data() {
    return {
      color: []
    }
  },
  mounted() {},
  methods: {
    updateValue(val) {
      this.$emit("colorChange", val.hex8)
    },
    hide() {
      this.$emit("update:visible", false)
    }
  }
}
</script>
<style lang="less" scoped>
.color-picker-con {
  position: absolute;
  background:#fff;
  .color-picker-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 10px 0;
  }
  .vc-sketch {
    box-shadow: unset;
  }
}
</style>

<template>
  <div v-if="visible" :style="objStyle" class="color-picker-con">
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
  methods: {
    updateValue(val) {
      this.$emit("colorChange", val.hex)
      this.$emit("update:visible", false)
    }
  }
}
</script>
<style lang="less" scoped>
.color-picker-con {
  position: absolute;
}
</style>

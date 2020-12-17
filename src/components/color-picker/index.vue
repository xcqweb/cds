<template>
  <div>
    <sketch-picker v-model="color" @input="updateValue"></sketch-picker>
  </div>
</template>
<script>
import { Sketch } from "vue-color"
export default {
  name: "ColorPicker",
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
    }
  }
}
</script>

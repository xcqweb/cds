<template>
  <div>
    <a-input-number
      v-model="gridSize"
      :min="1"
      :max="100"
      @change="sizeChange"
    />
    {{ gridSize }}
    <color-picker @colorChange="colorChange" />
    <button @click="undo">undo</button>
    <button @click="redo">redo</button>
    <basic-style></basic-style>
  </div>
</template>
<script>
import ColorPicker from "@c/color-picker"
import undoManager from "@u/undo-manager"
import basicStyle from "./basicStyle"
export default {
  components: {
    ColorPicker,
    basicStyle
  },
  data() {
    return {
      gridSize: 10
    }
  },
  created() {},
  methods: {
    sizeChange(size) {
      this.$store.commit("setGridSize", size)
      undoManager.saveApplyChange()
    },
    colorChange(color) {
      this.$store.commit("setGridColor", color)
      undoManager.saveApplyChange()
    },
    undo() {
      undoManager.applyUndo()
    },
    redo() {
      undoManager.applyRedo()
    }
  }
}
</script>

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
  </div>
</template>
<script>
import undoManager from "@u/undo-manager"
import ColorPicker from "@c/color-picker/index"
export default {
  components: {
    ColorPicker
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

    undo() {
      undoManager.applyUndo()
    },
    redo() {
      undoManager.applyRedo()
    }
  }
}
</script>
<style>
</style>

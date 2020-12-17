<template>
  <div>
    <a-input-number v-model="gridSize" :min="1" :max="100" @change="sizeChange" />
    {{gridSize}}
    <color-picker @colorChange="colorChange"/>
    <button @click="undo">undo</button>
    <button @click="redo">redo</button>
  </div>
</template>
<script>
import ColorPicker from '@c/color-picker'
import undoManager from '@u/undo-manager'
export default {
  components:{
    ColorPicker
  },
  data() {
    return {
      gridSize:10,
    }
  },
  created() {
    undoManager.saveApplyChange()                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
  },
  methods:{
    sizeChange(size) {
      this.$store.commit('setGridSize',size)
      undoManager.saveApplyChange()
    },
    colorChange(color) {
      this.$store.commit('setGridColor',color)
      undoManager.saveApplyChange()
    },
    undo() {
      undoManager.applyUndo()
    },
    redo() {
      undoManager.applyRedo()
    },
  }
}
</script>
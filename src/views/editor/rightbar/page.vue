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
    <button @click="copy">copy</button>
    <button @click="cut">cut</button>
    <button @click="paste">paste</button>
    <basic-style></basic-style>
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
    },
    copy() {
      this.dealCopyData()
      this.isCopy = true
    },
    dealCopyData() {
      const currentWidget = this.$store.getters.currentWidget
      if (currentWidget) {
        this.copyData = { ...currentWidget.attrs, ...currentWidget }
        let widgetCopyNum = currentWidget.copyNum
        widgetCopyNum++
        this.copyData.dname = `${this.copyData.cname} Copy ${
          widgetCopyNum === 1 ? "" : widgetCopyNum
        }`
      }
    },
    cut() {
      this.dealCopyData()
      this.$store.commit("widgetDel")
      this.isCut = true
    },
    paste() {
      if (this.isCopy || this.isCut) {
        if (this.isCut) {
          // ��֤��һ��cut��pastesʱ����ԭλճ����֮����ճ�����Ǹ���ճ����λ��+20)
          this.isCut = false
          this.isCopy = true
        } else {
          const currentWidget = this.$store.getters.currentWidget
          this.copyData.left = currentWidget.attrs.left + 20
          this.copyData.top = currentWidget.attrs.top + 20
        }
        this.$store.commit("widgetAdd", this.copyData)
      }
    }
  }
}
</script>
<style></style>

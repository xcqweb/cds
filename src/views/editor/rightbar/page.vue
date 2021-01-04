<template>
  <div>
    <a-input-number
      v-model="gridSize"
      :min="1"
      :max="100"
      @change="sizeChange"
    />
    {{ gridSize }}
    <button @click="undo">undo</button>
    <button @click="redo">redo</button>
    <button @click="copy">copy</button>
    <button @click="cut">cut</button>
    <button @click="paste">paste</button>
    <button @click="group">group</button>
    <button @click="ungroup">ungroup</button>
  </div>
</template>
<script>
import undoManager from "@u/undo-manager"
import { uuid } from "@u/uuid"
export default {
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
          this.isCut = false
          this.isCopy = true
        } else {
          const currentWidget = this.$store.getters.currentWidget
          this.copyData.left = currentWidget.attrs.left + 20
          this.copyData.top = currentWidget.attrs.top + 20
        }
        this.$store.commit("widgetAdd", this.copyData)
      }
    },
    group() {
      const selectWidgets = this.$store.getters.selectWidgets
      const cid = `g${uuid(16, 16)}`
      const cname = `GtGroup`
      const name = `组合`
      const attrs = this.computeGroup(selectWidgets)
      this.$store.commit('updateWidgetPatch',{pid:cid})
      this.$store.commit('widgetAdd',{cid,cname,name,...attrs})
    },
    ungroup() {

    },
    computeGroup(selectWidgets) {
      let minX = 10000,minY = 10000,maxX = 0,maxY = 0,maxZIndex = 0
      selectWidgets.forEach(item=>{
        let {left,top,width,height,zIndex} = item.attrs
        minX = Math.min(left,minX)
        minY = Math.min(top,minY)
        maxX = Math.max(left + width,maxX)
        maxY = Math.max(top + height,maxY)
        maxZIndex = Math.max(zIndex,maxZIndex)
      })
      return {
        left:minX,
        top:minY,
        width:maxX - minX,
        height:maxY - minY,
        zIndex:maxZIndex,
      }
    },
  }
}
</script>
<style></style>

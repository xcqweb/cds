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
    <button @click="del">delete</button>
    <button @click="paste">paste</button>
    <button @click="group">group</button>
    <button @click="ungroup">ungroup</button>
    <!--调整控件位置-->
    <adjuist-position></adjuist-position>


    
  </div>
</template>
<script>
import adjuistPosition from "../header/adjust-position"
import undoManager from "@u/undo-manager"
import { uuid } from "@u/uuid"
import helpMethods from "@/mixins/help-methods"
import config from "@/config"
import {isGroup,findWidgetChildren} from '@u/deal'
export default {
  components: {
    adjuistPosition
  },
  mixins: [helpMethods],
  data() {
    return {
      gridSize: 10
    }
  },
  created() {},
  methods: {
    sizeChange(size) {
      this.$store.commit("setGrid", { size })
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
        let widgetCopyNum = currentWidget.copyNum
        widgetCopyNum++
        this.copyData = { ...currentWidget.attrs, ...currentWidget }
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
      let widgets = this.$store.getters.selectWidgets
      const cid = `${uuid(16, 16)}`
      const cname = config.groupName
      const name = `组合`
      const attrs = this.calculateSelectWidgets(widgets)
      widgets.forEach(item=>{
        if(isGroup(item)) {
          this.ungroup(null,item)
        } 
      })
      widgets = this.$store.getters.selectWidgets
      widgets.forEach(item=>{
        let left = item.attrs.left - attrs.left
        let top = item.attrs.top - attrs.top
        this.$store.commit('updateWidgetAttrs',{left,top,cid:item.cid})
        this.$store.commit('updateWidget',{pid:cid,active:false,cid:item.cid})
      })
      this.$store.commit("widgetAdd", { cid, cname, name, ...attrs })
    },
    ungroup(evt,widget) {
      if(!widget) {
        widget = this.$store.getters.currentWidget
      }
      if(isGroup(widget)) {
        const childWidgets = findWidgetChildren(this.$store.getters.currentPage.widgets,widget)
        childWidgets.forEach(item=>{
          let {left,top} = widget.attrs
          this.$store.commit("updateWidget",{pid:'',cid:item.cid,active:true})
          left = item.attrs.left + left
          top = item.attrs.top + top
          this.$store.commit('updateWidgetAttrs',{left,top,cid:item.cid})
        })
        this.$store.commit('widgetDel',[widget])
      }
    },
    del() {
      this.$store.commit('widgetDel')
    }
  }
}
</script>
<style>
button {
  width: 60px;
  margin: 6px;
}
</style>

<template>
  <div
    class="text-editor-con"
    :style="objStyle"
    contenteditable="true"
    v-click-out-side="{ cb: blur, elExclude: 'text-style-con' }"
  >
    <div class="text" ref="textRef">
      {{ text }}
    </div>
  </div>
</template>
<script>
import helpComputed from "@/mixins/help-computed"
import { findWidgetById } from "@u/deal"
export default {
  name: "TextEditor",
  mixins: [helpComputed],
  data() {
    return {
      objStyle: {},
      text: ""
    }
  },
  mounted() {
    const widget = this.textEditor.widget
    let {
      left,
      top,
      width,
      height,
      color,
      justifyContent,
      alignItems,
      fontFamily,
      fontSize,
      fontWeight
    } = widget.attrs
    this.objStyle = {
      left: `${left}px`,
      top: `${top}px`,
      width: `${width}px`,
      height: `${height}px`,
      color,
      justifyContent,
      alignItems,
      fontFamily,
      fontSize: `${fontSize}px`,
      fontWeight: fontWeight ? "bolder" : "normal"
    }
    this.text = widget.text
    this.$store.commit("updateWidget", {active: false,cid:widget.cid })
    this.selectText(this.$refs.textRef)
  },
  methods: {
    blur() {
      const widget = this.textEditor.widget
      const text = this.$refs.textRef.innerText
      this.$store.commit("setTextEditor", { show: false, widget: null })
      this.$store.commit("updateWidget", {cid:widget.cid, text })
    },
    selectText(obj) {
      let range
      if (window.getSelection) {
        //ie11 10 9 ff safari
        obj.focus() //解决ff不获取焦点无法定位问题
        range = window.getSelection() //创建range
        range.selectAllChildren(obj) //range 选择obj下所有子内容
      } else if (document.selection) {
        //ie10 9 8 7 6 5
        range = document.selection.createRange() //创建选择对象
        range.moveToElementText(obj) //range定位到obj
        range.select()
      }
    }
  }
}
</script>
<style lang="less" scoped>
.text-editor-con {
  display: flex;
  position: absolute;
  min-width: 12px;
  min-height: 12px;
  outline: none;
  overflow: hidden;
  font-size: 12px;
  align-items: center;
  justify-content: center;
  color: rgb(16, 16, 16);
  background: transparent;
  border: 1px solid rgb(41, 141, 248);
  pointer-events: auto;
  text-align: center;
  .text {
    user-select: text;
    width: 100%;
    white-space: pre-wrap;
    word-break: break-word;
  }
}
</style>

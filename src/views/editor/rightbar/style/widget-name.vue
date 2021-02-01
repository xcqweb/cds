<template>
  <div class="widget-name-con">
    <div class="item-con">
      <div class="fs item-name" v-if="selectWidgets.length == 1 || textEditorShowFlag">
        <label>组件名称</label>
        <a-input size="small" v-model.trim="displayName" style="width: 60%" />
      </div>
      <div class="fs item-name">
        <label>是否隐藏</label>
        <a-switch v-model="attrs.visible" size="small" />
      </div>
      <div class="fs">
        <label>透明度</label>
        <a-slider
          v-model.number="opacity"
          :min="0"
          :max="100"
          style="width:30%"
        />
        <a-input
          size="small"
          v-model.number="opacity"
          type="number"
          style="width:30%"
          suffix="%"
        />
      </div>
    </div>
  </div>
</template>
<script>
import helpComputed from "@/mixins/help-computed"
export default {
  name: "WidgetName",
  mixins: [helpComputed],
  computed: {
    displayName: {
      get() {
        let res = ""
        if (this.operateWidget) {
          res = this.operateWidget.name
        }
        return res
      },
      set(name) {
        this.$store.commit("updateWidgetAttrs", { name })
      }
    },
    textEditorShowFlag() {
      // 编辑控件文本
      return this.textEditor.show
    },
    opacity: {
      get() {
        let res = this.attrs.opacity || 0
        return res * 100
      },
      set(val) {
        this.$store.commit("updateWidgetAttrs", { opacity: val / 100 })
      }
    }
  },
  data() {
    return {}
  },
  methods: {}
}
</script>
<style lang="less" scoped>
.widget-name-con {
  .item-name {
    margin-bottom: 10px;
  }
}
</style>

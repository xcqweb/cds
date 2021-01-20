<template>
  <div class="gt-text" :style="styleObj" @dblclick="dblclick">
    <text-con v-bind="$props" />
  </div>
</template>
<script>
import baseWidget from "@/mixins/base-widget"
import TextCon from "../../components/text-con"
const cname = "GtText"
export default {
  name: cname,
  components: {
    TextCon
  },
  mixins: [baseWidget],
  data() {
    return {}
  },
  created() {
    if (!this.text && !this.isPreview) {
      this.$store.commit("updateWidget", { text: "输入文本", cid: this.cid })
    }
  },
  methods: {
    dblclick() {
      if(!this.isPreview) {
        this.$store.commit("setTextEditorShow", { show: true, cid: this.cid })
      }
    }
  }
}
</script>
<style lang="less" scoped>
.gt-text {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background: #fff;
}
</style>

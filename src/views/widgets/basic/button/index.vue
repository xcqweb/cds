<template>
  <div class="gt-button" :style="styleObj" @dblclick.capture="dblclick">
    <text-con v-bind="$options.propsData" />
  </div>
</template>
<script>
import baseWidget from "@/mixins/base-widget"
import TextCon from "../../components/text-con"
const cname = "GtButton"
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
    if (!this.text) {
      this.$store.commit("updateWidget", { text: "按钮", cid: this.cid })
    }
  },
  methods: {
    dblclick() {
      this.$store.commit("setTextEditorShow", { show: true, cid: this.cid })
    }
  }
}
</script>
<style lang="less" scoped>
.gt-button {
  border-color: rgb(187, 187, 187);
  border-width: 1px;
  border-style: solid;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
}
</style>

<template>
  <div class="gt-circle" :style="styleObj" @dblclick.capture="dblclick">
    <text-con v-bind="$props" />
  </div>
</template>
<script>
import baseWidget from "@/mixins/base-widget"
import TextCon from "../../components/text-con"
const cname = "GtCircle"
export default {
  name: cname,
  components: {
    TextCon
  },
  mixins: [baseWidget],
  data() {
    return {}
  },
  created() {},
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
.gt-circle {
  display: flex;
  justify-content: center;
  align-items: center;
  border-color: rgb(187, 187, 187);
  border-width: 1px;
  border-style: solid;
  padding: 0px;
  border-radius: 100%;
  background: #fff;
}
</style>

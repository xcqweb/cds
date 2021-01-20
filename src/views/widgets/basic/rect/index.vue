<template>
  <div class="gt-rect" :style="styleObj" @dblclick.capture="dblclick">
    <text-con v-bind="$props" />
  </div>
</template>
<script>
import baseWidget from "@/mixins/base-widget"
import TextCon from "../../components/text-con"
const cname = "GtRect"
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
.gt-rect {
  display: flex;
  justify-content: center;
  align-items: center;
  border-color: rgb(187, 187, 187);
  border-width: 1px;
  border-style: solid;
  padding: 0px;
  background: #fff;
}
</style>

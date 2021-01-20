<template>
  <div class="text-con" :style="{visibility:`${textEditorShow ? 'hidden':'visible'}`}">
      {{ text }}
    </div>
</template>

<script>
import baseWidget from "@/mixins/base-widget"
export default {
  name:'TextCon',
  mixins: [baseWidget],
  props:{
    text:String,
    cid:String,
  },
  computed: {
    textEditorShow() {
      const obj = this.$store.state.textEditorShow
      return obj.show && this.cid == obj.cid
    },
  },
  mounted() {
  },
}
</script>
<style type="less" scoped>
.text-con{
  width: 100%;
  white-space: pre-wrap;
  text-align:center;
}
</style>
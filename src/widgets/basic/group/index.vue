<template>
  <div class="gt-group" :style="styleObj">
    <slot />
  </div>
</template>
<script>
import baseComponent from "@/mixins/base-editor"
const cname = "GtGroup"
export default {
  name: cname,
  mixins: [baseComponent],
  data() {
    return {}
  },
  created() {}
}
</script>
<style lang="less" scoped>
.gt-group {
}
</style>

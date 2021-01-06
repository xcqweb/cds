<template>
  <div class="gt-group" :style="styleObj">
    <slot />
  </div>
</template>
<script>
import baseComponent from "@/mixins/base-editor"
import config from "@/config"
const cname = config.groupName
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

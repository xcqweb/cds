<template>
  <div class="group-item" :style="groupStyleObj" />
</template>
<script>
import baseWidget from "@/mixins/base-widget"
import config from "@/config"
const cname = config.groupName
export default {
  name: cname,
  mixins: [baseWidget],
  computed: {
    groupStyleObj() {
      return { ...this.styleObj, backgroundColor: "transparent" }
    }
  },
  data() {
    return {}
  },
  created() {},
  methods: {}
}
</script>
<style lang="less" scoped></style>

<template>
  <div
    class="gt-group"
    :style="groupStyleObj"
    @click="groupClick"
    @dblclick="dblclick"
  >
    <slot />
  </div>
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
  methods: {
    groupClick() {
      if (this.timer) {
        this.clearTimer()
      }
      this.timer = setTimeout(() => {}, 200)
    },
    clearTimer() {
      clearTimeout(this.timer)
      this.timer = null
    },
    dblclick() {
      console.log("---group--dblclick---")
      if (this.timer) {
        this.clearTimer()
      }
    }
  }
}
</script>
<style lang="less" scoped>
.gt-group {
  background: transparent;
}
</style>

<template>
  <div
    class="gt-group"
    :style="styleObj"
    @click="groupClick"
    @dblclick="dblclick"
  >
    <slot />
  </div>
</template>
<script>
import baseWidget from "@/mixins/base-widget"
import { findWidgetById } from "@u/deal"
import config from "@/config"
const cname = config.groupName
export default {
  name: cname,
  mixins: [baseWidget],
  computed: {
    widget() {
      return findWidgetById(this.$store.getters.currentPage.widgets, this.cid)
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

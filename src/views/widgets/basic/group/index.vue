<template>
  <div
    class="group-item"
    :style="styleGropObj"
    @click="groupClick"
    @dblclick="dblclick"
  >
    <slot />
  </div>
</template>
<script>
import baseComponent from "@/mixins/base-editor"
import { findWidgetById } from "@u/deal"
import config from "@/config"
const cname = config.groupName
export default {
  name: cname,
  mixins: [baseComponent],
  computed: {
    styleGropObj() {
      return {
        ...this.styleObj,
        left: `${this.left}px`,
        top: `${this.top}px`,
        transform: `rotate(${this.rotate}deg)`
      }
    },
    widget() {
      return findWidgetById(this.$store.getters.currentPage.widgets, this.cid)
    },
    groupSelection() {
      return this.$store.state.groupSelection
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
      this.timer = setTimeout(() => {
        console.log(`oneclick`)
        this.$store.dispatch("updateGroupSelection", {
          show: true,
          widget: this.widget
        })
      }, 300)
    },
    clearTimer() {
      clearTimeout(this.timer)
      this.timer = null
    },
    dblclick() {
      if (this.timer) {
        this.clearTimer()
      }
      console.log(`dblClick`)
      if (!this.groupSelection.show) {
        this.$store.commit("setGroupSelection", {
          show: true,
          widget: this.widget
        })
      }
    }
  }
}
</script>
<style lang="less" scoped></style>

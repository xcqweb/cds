<template>
  <div class="group-item" :style="styleGropObj" @click="groupClick">
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
  computed:{
    styleGropObj() {
      return {
        ...this.styleObj,
        left:`${this.left}px`,
        top:`${this.top}px`,
        transform:`rotate(${this.rotate}deg)`,
      }
    }
  },
  data() {
    return {}
  },
  created() {
      
  },
  methods: {
    groupClick() {
      const widget = findWidgetById(this.$store.getters.currentPage.widgets,this.cid)
      this.$store.commit('setGroupSelection',{show:true,widget})
    }
  },
}
</script>
<style lang="less" scoped>
 
</style>

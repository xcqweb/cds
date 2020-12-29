<template>
  <div class="hint-con" :style="objStyle">
    {{ $store.state.hint.text }}
  </div>
</template>
<script>
export default {
  computed: {
    objStyle() {
      let {left,top,display,width} = this.$store.state.hint
      if(this.$el) {
        const {width:elWidth} = this.$el.getBoundingClientRect()
        left = left + width/2 - elWidth/2
      }
      return {
        left:`${left}px`,
        top:`${top}px`,
        display:`${display || 'none'}`
      }
    }
  },
  data() {
    return {}
  },
  created() {}
}
</script>
<style lang="less" scoped>
.hint-con {
  position: absolute;
  white-space: nowrap;
  background-color: #fff;
  border: 1px solid grey;
  padding: 4px 16px;
  border-radius: 3px;
  box-shadow: 1px 1px 2px 0 #ddd;
  opacity: .8;
  filter: alpha(opacity=80);
  font-size: 12px;
}
</style>

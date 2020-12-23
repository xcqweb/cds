<template>
  <div class="gt-text" :style="this.$props">
    输入文本
  </div>
</template>
<script>
export default {
  name:'GtText',
  props:{
    left:{default:0,type:String},
    top:{default:0,type:String},
    width:{default:'60px',type:String},
    height:{default:'30px',type:String},
    name:{type:String},
    cname:{type:String},
    isEdit:{type:Boolean}
  },
  created() {
    this.left = parseFloat(this.left) - parseFloat(this.width) + 'px'
    this.top = parseFloat(this.top) - parseFloat(this.height) + 'px'
  },
}
</script>
<style lang="less" scoped>
.gt-text{
  display:flex;
  justify-content:center;
  align-items:center;
  border:solid 1px red
}
</style>
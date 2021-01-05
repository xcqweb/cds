<template>
  <div>
    <a-modal v-model="visibleFlag" title="Basic Modal" @ok="handleOk">

    </a-modal>
  </div>
</template>

<script>
export default {
  name:'modal',
  props: {
    visible: {
      type: Boolean,
      default(){
        return false
      }
    }
  },
  watch:{
    visible(curVal) {
      this.visibleFlag = curVal
    },
  },
  data() {
    return {
      visibleFlag:false
    };
  },
  methods: {
    handleOk(e) {
      console.log(e);
      this.$emit('hideDialog',false)
    },
  },
}
</script>

<style scoped>

</style>

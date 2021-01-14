<template>
  <div class="add-image-widget" :style="styleObj">
    <input ref="input" type="file" style="display:none" @change="selectImg" />
    <div @click="selectImgHandler" class="fc" :style="styleObj">
      <slot></slot>
    </div>
  </div>
</template>
<script>
import { validateImage } from "@u/image-helpers"
export default {
  props: {
    styleObj: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    selectImgHandler() {
      this.$refs.input.click()
    },
    async selectImg({ currentTarget: inputNode }) {
      try {
        const file = inputNode.files
        const imgFile = file && file[0]
        await validateImage(imgFile)
        this.$emit("addImage", imgFile)
      } catch (e) {
        console.error(e)
      } finally {
        inputNode.value = ""
      }
    }
  }
}
</script>
<style lang="less" scoped>
.add-image-widget {
  width: 100%;
  box-sizing: border-box;
  padding: 10px;

  .add-image {
    width: 100%;
  }
  .fc {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  img {
    width: 100%;
    height: 100%;
  }
}
</style>

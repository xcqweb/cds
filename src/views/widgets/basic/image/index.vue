<template>
  <div class="add-image-widget" :style="styleObj">
    <input ref="input" type="file" style="display:none" @change="selectImg" />
    <div @click="selectImgHandler" v-if="src" :style="styleObj">
      <img :src="src" alt="" />
    </div>
  </div>
</template>
<script>
import baseWidget from "@/mixins/base-widget"
import { validateImage } from "@u/image-helpers"
let imgUrl = require("./logo.png")
const cname = "GtImage"
export default {
  name: cname,
  mixins: [baseWidget],
  data() {
    return {
      src: imgUrl
    }
  },
  computed: {},
  created() {},
  methods: {
    selectImgHandler() {
      this.$refs.input.click()
    },
    async selectImg({ currentTarget: inputNode }) {
      try {
        const file = inputNode.files
        const imgFile = file && file[0]
        await validateImage(imgFile)
        const src = ""
        this.addImage({ src })
      } catch (e) {
        console.error(e)
      } finally {
        inputNode.value = ""
      }
    },
    addImage({ src }) {
      //base的图片路径
      console.log(src)
      this.src = src
      // this.addItem(new ImageWidget({ wState: { src }}))
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
  img {
    width: 100%;
    height: 100%;
  }
}
</style>

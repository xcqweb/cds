<template>
  <div>
    <upload-image @addImage="addImage" :styleObj="styleObj">
      <img :src="src" alt="" />
    </upload-image>
  </div>
</template>
<script>
import baseWidget from "@/mixins/base-widget"
import uploadImage from "@c/upload"
const cname = "GtImage"
let imgUrl = require("./logo.png")
export default {
  name: cname,
  components: {
    uploadImage
  },
  mixins: [baseWidget],
  data() {
    return {
      src: imgUrl
    }
  },
  computed: {},
  created() {},
  methods: {
    addImage(imgFile) {
      //base的图片路径
      console.log(imgFile)
      this.src = imgFile
      this.addItem({ wState: { imgFile } })
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

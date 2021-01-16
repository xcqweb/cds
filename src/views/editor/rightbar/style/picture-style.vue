<template>
  <div class="pic-style-con" v-if="cname == 'GtImage'">
    <div class="item-con fs">
      <label>选择图片</label>
      <a-upload-dragger
        name="file"
        action=""
        @change="handlePicChange"
        class="upload-con"
      >
        <div class="default-con">
          <svg-icon icon-class="default" class-name="icon" />
          <span>选择图片</span>
        </div>
      </a-upload-dragger>
    </div>
  </div>
</template>
<script>
import helpComputed from "@/mixins/help-computed"
export default {
  name: "PictureStyle",
  mixins: [helpComputed],
  data() {
    return {}
  },
  methods: {
    handlePicChange() {}
  }
}
</script>
<style lang="less" scoped>
.pic-style-con {
  .upload-con {
    width: 138px;
    height: 89px;
    background: #f7f7f8;
    border-radius: 2px;
    .default-con {
      display: flex;
      flex-direction: column;
      align-items: center;
      span {
        font-size: 12px;
        color: #040c2c;
      }
      .icon {
        width: 2.8em;
        height: 3em;
        color: #c3cbce;
      }
    }
  }
}
</style>

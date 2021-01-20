<template>
  <div class="pic-style-con" v-if="cname == 'GtImage'">
    <div class="item-con fs">
      <label>选择图片</label>
      <a-upload-dragger
        name="file"
        :data="fileData"
        :headers="headerInfo"
        :action="uploadUrl"
        accept="image/jpg,image/jpeg,image/png"
        :showUploadList="false"
        @change="handlePicChange"
        class="upload-con fc"
      >
        <div class="default-con" v-if="!imgSrc">
          <svg-icon icon-class="default-pic" class-name="icon" />
          <span>选择图片</span>
        </div>
        <img v-else :src="imgSrc" class="pic-cls" />
      </a-upload-dragger>
    </div>
  </div>
</template>
<script>
import helpComputed from "@/mixins/help-computed"
import { getToken } from "@/utils/cookie"
import fileApi from "@a/file"
export default {
  name: "PictureStyle",
  mixins: [helpComputed],
  computed: {
    imgSrc: {
      get() {
        let res = ""
        res = this.$imgUrl(this.attrs.imgSrc)
        return res
      },
      set(imgSrc) {
        this.$store.commit("updateWidgetAttrs", { imgSrc })
      }
    }
  },
  data() {
    return {
      uploadUrl: fileApi.uploadFile,
      fileData: { bucketName: fileApi.bucketName },
      headerInfo: { Authorization: getToken() }
    }
  },
  methods: {
    handlePicChange(info) {
      const { response, status } = info.file
      if (status === "done" && response.code == 0) {
        this.imgSrc = response.data
      }
    }
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
    /deep/.ant-upload {
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      .ant-upload-drag-container {
        width: 100%;
        height: 100%;
      }
    }
    .pic-cls {
      width: 100%;
      height: 100%;
    }
  }
}
</style>

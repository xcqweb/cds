<template>
  <div class="page">
    <div class="title item-con">
      <label>页面样式</label>
    </div>

    <div class="item-con">
      <label class="label-block">页面尺寸</label>
      <a-select
        v-model="pageSizeModel"
        @change="pageSizeChange"
        size="small"
        style="width:100%;"
      >
        <a-select-option v-for="item in pageSizeList" :key="item" :value="item">
          {{ item }}
        </a-select-option>
      </a-select>
      <div v-if="showPageCustom" class="page-custom fs">
        <a-input
          size="small"
          v-model="pw"
          type="number"
          suffix="W"
          style="width: 45%"
          @change="pageInputChange"
        />
        <a-input
          size="small"
          v-model="ph"
          type="number"
          suffix="H"
          style="width: 45%"
          @change="pageInputChange"
        />
      </div>
    </div>

    <div class="item-con fs" v-if="!backgroundImage">
      <label>背景颜色</label>
      <div
        class="page-bg"
        :style="bgStyle"
        @click="showColorPicker('bg', $event)"
      />
    </div>

    <div class="item-con fs" v-if="!backgroundImage">
      <label>网格</label>
      <div
        class="page-bg grid"
        :style="gridStyle"
        @click="showColorPicker('grid', $event)"
      />
      <a-input
        size="small"
        v-model="gridSize"
        type="number"
        style="width: 30%"
      />
    </div>

    <div class="item-con fs">
      <label>背景图片</label>
      <a-upload-dragger
        name="file"
        :data="fileData"
        :headers="headerInfo"
        :action="uploadUrl"
        :showUploadList="false"
        accept="image/jpg,image/jpeg,image/png"
        @change="handlePicChange"
        class="upload-con fc"
      >
        <div class="default-con" v-if="!backgroundImage">
          <svg-icon icon-class="default-pic" class-name="icon" />
          <span>选择背景图片</span>
        </div>
        <div class="pic-con" v-else>
          <img :src="backgroundImage" class="pic-cls" />
        </div>
        <svg-icon
          v-if="backgroundImage"
          icon-class="delete"
          class="icon-del"
          @click.stop.native="delPagePic"
        />
      </a-upload-dragger>
    </div>
    <div class="item-con">
      <label class="label-block">导航布局</label>
      <div class="fs">
        <div
          class="layout-item fc"
          @click="changNavPosition(0)"
          :class="{ select: navPosition == 0 }"
        >
          无
        </div>
        <div
          class="layout-item"
          @click="changNavPosition(1)"
          :class="{ select: navPosition == 1 }"
        >
          <div class="left" />
        </div>
        <div
          class="layout-item"
          @click="changNavPosition(2)"
          :class="{ select: navPosition == 2 }"
        >
          <div class="top" />
        </div>
      </div>
    </div>
    <div class="item-con" v-if="navPosition > 0">
      <label class="label-block">导航风格</label>
      <a-select
        v-model="navModel"
        size="small"
        style="width:100%;"
        @change="navThemeChange"
      >
        <a-select-option
          v-for="item in navList"
          :key="item.value"
          :value="item.value"
        >
          {{ item.label }}
        </a-select-option>
      </a-select>
      <div class="fs" v-if="navModel" style="margin-top:10px;">
        <div
          v-for="(d, index) in navColorList"
          :key="index"
          class="nav-color fc"
          @click="changeNavColor(index)"
          :class="{ select: index + 1 == navColorModel }"
        >
          <div :style="{ backgroundColor: d.label }" class="item" />
        </div>
      </div>
    </div>
    <div class="item-con fs">
      <label>数据拉取频率</label>
      <a-input
        size="small"
        v-model.number="dataRate"
        type="number"
        :min="3"
        suffix="秒"
        style="width: 60%"
      />
    </div>
    <color-picker
      :visible.sync="visibleColor"
      :objStyle="objStyle"
      @colorChange="colorChange"
    />
  </div>
</template>
<script>
import ColorPicker from "@c/color-picker/index"
import helpComputed from "@/mixins/help-computed"
import config from "@/config"
import { getToken } from "@/utils/cookie"
import fileApi from "@a/file"
const pageSizeList = ["1366 * 768", "1280 * 720", "1920 * 1080", "自定义"]
const transparentImg = `url(${require("@/assets/images/transparent.png")})`
export default {
  name: "PageStyle",
  mixins: [helpComputed],
  components: {
    ColorPicker
  },
  computed: {
    pageSize: {
      get() {
        let res = pageSizeList[0]
        if (this.currentPage) {
          let { width, height } = this.currentPage
          width = width || config.defaultPage.width
          height = height || config.defaultPage.height
          res = `${width}*${height}`
        }
        return res
      },
      set(val) {
        if (val != "自定义") {
          const arr = val.split("*")
          this.$store.dispatch("updatePageInfo", {
            width: parseInt(arr[0]),
            height: parseInt(arr[1])
          })
        }
      }
    },
    bgStyle: {
      get() {
        let backgroundColor = config.defaultPageColor
        if (this.currentPage) {
          backgroundColor = this.currentPage.backgroundColor
        }
        let background = backgroundColor
        if (
          backgroundColor === "#00000000" ||
          backgroundColor === "transparent"
        ) {
          background = transparentImg
        }
        return { background }
      },
      set(backgroundColor) {
        this.$store.dispatch("updatePageInfo", { backgroundColor })
      }
    },
    backgroundImage: {
      get() {
        let res = ""
        if (this.currentPage) {
          res = this.$imgUrl(this.currentPage.backgroundImage)
        }
        return res
      },
      set(backgroundImage) {
        this.$store.dispatch("updatePageInfo", { backgroundImage })
      }
    },
    gridSize: {
      get() {
        let size = config.grid.size
        if (this.currentPage) {
          size = this.currentPage.grid.size
        }
        return size
      },
      set(val) {
        let { color } = this.currentPage.grid
        color = color || config.grid.color
        this.$store.dispatch("updatePageInfo", { grid: { size: val, color } })
      }
    },
    gridStyle: {
      get() {
        let color = config.grid.color
        if (this.currentPage) {
          let grid = this.currentPage.grid || config.grid
          color = grid.color
        }
        let background = color
        if (color === "#00000000" || color === "transparent") {
          background = transparentImg
        }
        return { background }
      },
      set(val) {
        let { size } = this.currentPage.grid
        size = size || config.grid.size
        this.$store.dispatch("updatePageInfo", { grid: { color: val, size } })
      }
    },
    navPosition: {
      get() {
        return this.$store.state.apply.navPosition || 0
      },
      set(navPosition) {
        this.$store.dispatch("updateApply", { navPosition })
      }
    },
    navStyle: {
      get() {
        let res = {}
        const navStyleTemp = this.$store.state.apply.navStyle
        if (navStyleTemp) {
          res = JSON.parse(navStyleTemp)
        }
        return res
      },
      set(navStyle) {
        this.$store.dispatch("updateApply", { navStyle })
      }
    },
    dataRate: {
      get() {
        return this.$store.state.apply.dataRate || 3
      },
      set(dataRate) {
        this.$store.dispatch("updateApply", { dataRate })
      }
    }
  },
  watch: {
    navStyle() {
      this.navModel = this.navStyle.mode || "dark"
      this.navColorModel = this.navStyle.theme || 1
    }
  },
  data() {
    return {
      pageSizeList,
      showPageCustom: false,
      pageSizeModel: "",
      pw: "",
      ph: "",
      visibleColor: false,
      objStyle: {},
      navList: config.navList,
      navModel: "dark",
      navColorModel: 1,
      navColorList: config.navColorList,
      headerInfo: { Authorization: getToken() },
      uploadUrl: fileApi.uploadFile,
      fileData: { bucketName: fileApi.bucketName }
    }
  },
  created() {
    this.$nextTick(() => {
      this.dealPageSizeModel(this.pageSize)
    })
  },
  methods: {
    dealPageSizeModel(val) {
      this.pageSizeModel = val
      const arr = val.split("*")
      this.pw = parseInt(arr[0])
      this.ph = parseInt(arr[1])
    },
    pageInputChange() {
      this.pageSize = `${this.pw}*${this.ph}`
    },
    showColorPicker(type, evt) {
      this.colorType = type
      const { srcElement } = evt
      const { top } = srcElement.getBoundingClientRect()
      this.objStyle = {
        left: "calc(-100% + 9px)",
        top: `${top - 80}px`
      }
      this.visibleColor = true
    },
    colorChange(val) {
      switch (this.colorType) {
        case "bg":
          this.bgStyle = val
          break
        case "grid":
          this.gridStyle = val
          break
      }
    },
    handlePicChange(info) {
      const { response, status } = info.file
      if (status === "done" && response.code == 0) {
        this.backgroundImage = response.data
      }
    },
    pageSizeChange(val) {
      if (val == "自定义") {
        this.showPageCustom = true
      } else {
        this.pageSize = val
      }
    },
    changNavPosition(pos) {
      this.navPosition = pos
    },
    changeNavColor(index) {
      this.navColorModel = index + 1
      this.saveApplyNav()
    },
    navThemeChange() {
      this.saveApplyNav()
    },
    saveApplyNav() {
      this.navStyle = JSON.stringify({
        mode: this.navModel,
        theme: this.navColorModel
      })
    },
    delPagePic() {
      this.backgroundImage = ""
    }
  }
}
</script>
<style lang="less" scoped>
.page {
  font-size: 12px;
  color: #040c2c;
  width: 100%;
  position: relative;
  .page-custom {
    margin-top: 10px;
    display: flex;
  }
  .page-bg {
    width: 60%;
    height: 30px;
    border: solid 1px #bbbbbb;
    cursor: pointer;
    &.grid {
      width: 36%;
    }
  }
  .upload-con {
    width: 138px;
    height: 89px;
    background: #f7f7f8;
    border-radius: 2px;
    position: relative;
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
    }
    .pic-con {
      position: relative;
      .pic-cls {
        height: 85px;
        max-width: 132px;
        margin: 0 auto;
      }
    }
    .icon-del {
      color: #333;
      cursor: pointer;
      position: absolute;
      top: 3px;
      right: 2px;
    }
  }
  .layout-item {
    width: 63px;
    height: 42px;
    background: #ffffff;
    border-radius: 2px;
    border: 1px solid #cdced5;
    cursor: pointer;
    &:hover,
    &.select {
      border-color: #1740dc;
    }
    .left {
      width: 10px;
      height: 40px;
      background: #1740dc;
      border-radius: 1px 0px 0px 1px;
      opacity: 0.6;
    }
    .top {
      width: 61px;
      height: 9px;
      background: #1740dc;
      border-radius: 1px 1px 0px 0px;
      opacity: 0.6;
    }
  }
  .nav-color {
    width: 30px;
    height: 30px;
    border: 1px solid #cdced5;
    cursor: pointer;
    .item {
      width: 18px;
      height: 18px;
    }
    &:hover,
    &.select {
      border-color: #1740dc;
    }
  }
}
</style>

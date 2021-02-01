<template>
  <div class="toolbar-right">
     <div>
       <a class="center-item" @click.prevent>
        <a-dropdown overlayClassName="toolbar-drop">
          <div>
            <div style="display:flex;margin-bottom:3px;">
              <svg-icon icon-class="canvas" class-name="icon" />
              <svg-icon
                icon-class="arrow-down"
                slot="icon"
                style="margin-left:3px;"
              />
            </div>
            <span>画布</span>
          </div>
          <a-menu slot="overlay">
            <a-menu-item @click="canvasChange('rule')">
              标尺
              <svg-icon icon-class="confirm-check" v-if="ruleModel" class="confirm-icon"/>
            </a-menu-item>
            <a-menu-item @click="canvasChange('grid')" >
              网格
              <svg-icon icon-class="confirm-check" v-if="gridModel" class="confirm-icon"/>
            </a-menu-item>
            <a-menu-item @click="canvasChange('line')">
              参考线
              <svg-icon icon-class="confirm-check" v-if="lineModel" class="confirm-icon"/>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </a>
      <a class="center-item room-item">
        <a-dropdown>
          <div>{{ scaleText }} <a-icon type="down" /></div>
          <a-menu slot="overlay">
            <a-menu-item
              v-for="(item, index) in scaleList"
              :key="index"
              @click="changeScale(item)"
            >
              {{ item * 100 }}%
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </a>
    </div>
    <div>
      <a class="right-item" @click.prevent="save">
        <svg-icon icon-class="save" class-name="icon" />
        <span>保存</span>
      </a>
      <a class="right-item" @click.prevent="run">
        <svg-icon icon-class="run" class-name="icon" />
        <span>运行</span>
      </a>
    </div>
  </div>
</template>
<script>
import helpComputed from "@/mixins/help-computed"
export default {
  name: "ToolbarRight",
  mixins: [helpComputed],
  computed: {
    ruleModel: {
      get() {
        return this.$store.state.apply.ruleEnable == 1
      },
      set(val) {
        this.$store.dispatch("updateApply", { ruleEnable: val ? 1 : 0 })
      }
    },
    gridModel: {
      get() {
        return this.$store.state.apply.gridEnable == 1
      },
      set(val) {
        this.$store.dispatch("updateApply", { gridEnable: val ? 1 : 0 })
      }
    },
    scaleText: {
      get() {
        const scale = this.$store.state.apply.scale || 1
        return scale * 100 + "%"
      },
      set(scale) {
        this.$store.dispatch("updateApply", { scale })
      }
    },
  },
  data() {
    return {
      scaleList: [0.25, 0.5, 0.75, 1, 1.5, 2.0, 3.0],
      lineModel:true,
    }
  },
  methods: {
    canvasChange(type) {
      switch(type) {
        case 'rule':
          this.ruleModel = !this.ruleModel
          break
        case 'grid':
          this.gridModel = !this.gridModel
          break
        case 'line':
          this.lineModel = !this.lineModel
          let eles = document.querySelectorAll("#mb-ruler .lines")
          if (eles) {
            [].forEach.call(eles, ele => {
              ele.style.visibility = this.lineModel ? "visible" : "hidden"
            })
            if(!this.lineModel) {
              this.$store.commit("setPageInfo", {lines:{ h: [], v: [] }})
            }
          }
          break
      }
    },
    changeScale(item) {
      this.scaleText = item
    },
    save() {
      this.$store.dispatch("patchModifyWidgets")
    },
    run() {
      this.$store.dispatch("patchModifyWidgets")
      const url = this.$router.resolve({
        path: "/preview-app",
        query: { applyId: this.$store.state.apply.id }
      })
      window.open(url.href, "_blank")
    }
  }
}
</script>
<style lang="less">
.toolbar-right {
  flex-basis: 230px;
  display: flex;
  width: 230px;
  height: 100%;
  justify-content: space-between;
    & > div {
    display: flex;
  }
  .right-item {
    position: relative;
    border-top: 2px solid transparent;
    height: 100%;
    width: 44px;
    color: rgb(91, 107, 115);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-right: 20px;
    .icon {
      font-size: 16px;
    }
    span {
      color: #040c2c;
      border-top: 2px solid transparent;
    }
  }
}
.toolbar-drop{
  .ant-dropdown-menu-item {
    width:80px;
    padding:0 9px;
    display: flex;
    height:28px;
    align-items: center;
    justify-content: space-between;
    font-size:12px;
    line-height: normal;
    color:#040C2C;
    &:hover{
      background: #F0F1F3;
    }
    .confirm-icon {
      width:16px;
      height: 16px;
      color:#1740DC;
    }
  }
}
</style>

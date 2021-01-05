<template>
  <div class="left-con" style="width:381px">
    <div>
      <a-tabs tab-position="left">
        <a-tab-pane key="1">
          <span slot="tab">
             <a-tooltip placement="right">
            <template slot="title">
              <span>页面</span>
            </template>
            <a-icon type="android" />
          </a-tooltip>
        </span>
          <pageMenu></pageMenu>
        </a-tab-pane>
        <a-tab-pane key="2">
          <span slot="tab">
           <a-tooltip placement="right">
            <template slot="title">
              <span>基本组件</span>
            </template>
            <a-icon type="apple" />
          </a-tooltip>
          </span>
          <div class="widget-con">
            <ul class="widget-item-list" @dragstart="dragstart">
              <li
                class="widget-item"
                v-for="(item, index) in widgets"
                :key="item.name"
                draggable="true"
                :data-index="index"
              >
                <div class="img-wrapper">
                  {{ item.cname }}
                </div>
                <span>{{ item.name }}</span>
              </li>
            </ul>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
import pageMenu from "@v/editor/leftbar/pageMenu"
export default {
  components:{
    pageMenu
  },
  data() {
    return {}
  },
  computed: {
    widgets() {
      return this.$store.state.widgets.basic
    }
  },
  created() {},
  methods: {
    dragstart(evt) {
      const { x, y, srcElement } = evt // 开始拖拽时候，鼠标的位置
      const { left, top } = srcElement.getBoundingClientRect() // 拖拽元素与html文档的距离
      let dx = x - left
      let dy = y - top
      const item = this.widgets[srcElement.dataset.index]
      evt.dataTransfer.setData("item", JSON.stringify({ ...item, dx, dy }))
    }
  }
}
</script>

<style lang="less">
.left-con {
  width: 209px;
  box-sizing: content-box;
  position: relative;
  display: flex;
  flex-direction: column;
  background: rgb(255, 255, 255);
  border-right: 1px solid rgb(219, 219, 219);
  z-index: 4;
  .widget-con {
    flex: 1 1 0%;
    width: 100%;
    overflow: hidden auto;
    .widget-item-list {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      padding: 0px 0px 10px 10px;
      .widget-item {
        width: 75px;
        height: 70px;
        margin-top: -1px;
        margin-left: -1px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background: rgb(255, 255, 255);
        border: 1px solid rgb(235, 235, 235);
        color: rgb(91, 107, 115);
        cursor: move;
      }
      .img-wrapper {
        width: 75px;
        height: 70px;
        background-color: rgb(255, 255, 255);
        border: 1px solid rgb(235, 235, 235);
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
</style>

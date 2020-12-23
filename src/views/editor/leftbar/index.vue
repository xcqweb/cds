<template>
  <div class="left-con">
    <h2>基本组件</h2>
    <div class="widget-con">
      <draggable
        class="widget-item-list"
        :group="{ name: 'design', pull: 'clone', put: false }"
        :forceFallback="true"
        tag="ul"
        v-model="widgets"
        :move="move"
        @end="end"
      >
        <li class="widget-item" v-for="item in widgets" :key="item.name">
          <div class="img-wrapper">
            {{ item.cname }}
          </div>
          <span>{{ item.name }}</span>
        </li>
      </draggable>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable"
export default {
  components: {
    draggable
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
    move(a, b, c) {
      this.isMoveToCanvas = true // 是否移动到画布
      return false
    },
    end(evt) {
      if (this.isMoveToCanvas) { // 拖动组件到画布上
        console.log("---end--", evt)
        this.isMoveToCanvas = false
        const { oldIndex } = evt
        const item = this.widgets[oldIndex]
        evt.cname = item.cname
        evt.name = item.name
        this.$store.commit("widgetAdd", evt)
      }
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

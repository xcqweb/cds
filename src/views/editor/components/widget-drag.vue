<template>
  <div class="widget-drag-con">
    <template v-for="widget in widgets">
      <drag-line
        v-if="widget.cname == 'GtLine'"
        :widget="widget"
        :key="widget.cid"
      />
      <template v-else>
        <div v-if="widget.pid" :style="objStyle(widget)" :key="widget.cid" class="p-drag-con" :class="{'active':widget.active}">
          <drag-item :widget="widget" :pwidget="getPwidget(widget)"/>
        </div>
        <drag-item :widget="widget" :key="widget.cid" v-else/>
      </template>
    </template>
  </div>
</template>
<script>
import DragLine from "./drag-line"
import DragItem from "./drag-item"
import {findWidgetById } from "@u/deal"
export default {
  name: "WidgetDrag",
  components: {
    DragLine,
    DragItem
  },
  computed: {
    widgets() {
      return this.$store.getters.currentPage.widgets
    },
  },
  data() {
    return {
    }
  },
  methods: {
    objStyle(widget) {
      let pwidget = this.getPwidget(widget)
      const {left,top,width,height,rotate} = pwidget.attrs
      return {
        left:`${left}px`,
        top:`${top}px`,
        width:`${width}px`,
        height:`${height}px`,
        transform: `rotate(${rotate}deg)`,
      }
    },
    getPwidget(widget) {
      return findWidgetById(this.widgets,widget.pid)
    },
  },
}
</script>
<style lang="less">
.widget-drag-con {
  pointer-events: none;
  width: 100%;
  height: 100%;
  .p-drag-con{
    position: absolute;
    pointer-events: none;
    &.active{
      z-index:1;
    }
  }
}
</style>

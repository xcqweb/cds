<template>
  <div class="group-item" :style="objStyle" @click="click">
    <template v-if="widget.children">
      <widget-item
        v-for="item in widget.children"
        :pwidget="widget"
        :key="item.cid"
        :widget="item"
      />
    </template>
    <component
      v-else
      :is="widget.cname"
      v-bind="widget.attrs"
      :text="widget.text"
      :cid="widget.cid"
    />
  </div>
</template>
<script>
import components from "@/views/widgets/index"
import helpMethods from "@/mixins/help-methods"
import helpComputed from "@/mixins/help-computed"
export default {
  name: "WidgetItem",
  mixins: [helpMethods, helpComputed],
  components: {
    ...components
  },
  props: {
    widget: Object,
    pwidget: Object // 父控件
  },
  computed: {
    objStyle() {
      let { width, height, left, top, rotate } = this.widget.attrs
      if (this.pwidget) {
        const { left: pleft, top: ptop } = this.pwidget.attrs
        left = left - pleft
        top = top - ptop
      }
      if (this.widget.cname == "GtLine") {
        rotate = 0
      }
      rotate = String(rotate).trim()
      if(!rotate) {
        rotate = 0
      }
      return {
        width: `${width}px`,
        height: `${height}px`,
        left: `${left}px`,
        top: `${top}px`,
        transform: `rotate(${rotate}deg)`
      }
    }
  },
  data() {
    return {}
  },
  created() {},
  beforeDestroy() {},
  methods: {
    click() {
      let { cid, pid } = this.widget
      if (pid) {
        cid = pid
      }
      this.$store.commit("updateWidget", { active: true, cid })
    }
  }
}
</script>
<style lang="less">
.group-item {
  position: absolute;
  cursor: move;
}
</style>

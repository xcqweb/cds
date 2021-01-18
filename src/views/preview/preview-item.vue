<template>
  <div class="group-item" :style="styleObj">
    <component :is="widget.cname" v-bind="widget.attrs" :text="widget.text">
      <template v-if="widget.children">
        <preview-item
          v-for="item in widget.children"
          :key="item.cid"
          :widget="item"
        />
      </template>
    </component>
  </div>
</template>

<script>
import components from "@/views/widgets/index"

export default {
  name: "PreviewItem",
  components: {
    ...components
  },
  props: {
    widget: Object
  },
  data() {
    return {
      styleObj: {}
    }
  },
  created() {
    const { width, height, left, top, rotate, zIndex } = this.widget.attrs
    this.styleObj = {
      width: `${width}px`,
      height: `${height}px`,
      left: `${left}px`,
      top: `${top}px`,
      transform: `rotate(${rotate}deg)`,
      zIndex
    }
  }
}
</script>
<style lang="less" scoped>
.group-item {
  position: absolute;
}
</style>

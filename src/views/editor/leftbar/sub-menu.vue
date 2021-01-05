<!--支持多级子菜单-->
<template functional>
  <a-sub-menu :key="props.menuInfo.name">
    <span slot="title" style="display: flex;justify-content: space-between">
      <div>
        <a-icon type="mail" />
        <span>{{ props.menuInfo.name }}</span>
      </div>
      <div>
        <slot></slot>
      </div>
    </span>
    <template v-for="(item, index) in props.menuInfo.children">
      <a-menu-item v-if="!item.children" :key="index">
        <div style="display: flex;justify-content: space-between">
          <div>
            <a-icon type="pie-chart" />
            <span>{{ item.name }}-111</span>
          </div>
          <div>
            <slot></slot>
          </div>
        </div>
      </a-menu-item>
      <sub-menu v-else :key="item.name" :menu-info="item">
        <slot></slot>
      </sub-menu>
    </template>
  </a-sub-menu>
</template>
<script>
export default {
  components: {},
  props: {
    menuInfo: {
      type: Object,
      default() {
        return []
      }
    }
  },
  watch: {},
  data() {
    return {}
  },
  methods: {}
}
</script>

<template>
  <vue-context ref="menu">
    <li v-for="(item,index) in menuList" :key="index" @click.prevent="onClick(item)"
    >
      <a   style="display: flex;justify-content: space-between">
        <span>{{item.label}}</span>
        <span>{{item.operate}}</span>
      </a>
    </li>
  </vue-context>
</template>

<script>
import VueContext from 'vue-context';
export default {
  name: "index",
  components: {
    VueContext
  },
  props: {
    menuList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  watch: {},
  methods: {
    command(item) {
      this.$emit('executeCommand', item)
    },
    onClick(item) {
      alert(`You clicked ${item.command}!`);
    },
    openContextmenu(event) {
      this.$refs.menu.open(event)
    },
  }
}
</script>

<style lang="less">
@import '~vue-context/dist/css/vue-context.css';
</style>

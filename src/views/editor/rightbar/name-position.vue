<template>
  <div class="ge-border">
    <div class="fs ge-h40">
      <label>组件名称</label>
      <a-input v-model="pos.name" placeholder="Basic usage" />
    </div>
    <div class="fs ge-h40">
      <label>X</label>
      <a-input v-model="pos.x" placeholder="Basic usage" />
    </div>
    <div class="fs ge-h40">
      <label>Y</label>
      <a-input v-model="pos.y" placeholder="Basic usage" />
    </div>
    <div class="fs ge-h40">
      <label>width</label>
      <a-input v-model="pos.w" placeholder="Basic usage" />
    </div>
    <div class="fs ge-h40">
      <label>height</label>
      <a-input v-model="pos.h" placeholder="Basic usage" />
    </div>
  </div>
</template>

<script>
export default {
  name: "name-position",
  props: {
    pos: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {}
  }
}
</script>

<style scoped>
.fs {
  display: flex;
  justify-content: space-between;
}
.ge-h40 {
  height: 40px;
  line-height: 40px;
}
label {
  width: 80px;
  text-align: center;
}
.ge-border {
  border-bottom: 1px solid #323a3e;
}
</style>

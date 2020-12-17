<template>
  <div class="sub-con">
    <ruler />
  </div>
</template>

<script>
import Ruler from "@c/ruler"
export default {
  name: "SubContent",
  components: { Ruler },
  data() {
    return {}
  },
  methods: {}
}
</script>
<style lang="less">
.sub-con {
  flex: 1 1 0%;
  display: flex;
  flex-direction: column;
  min-width: 400px;
  position: relative;
  pointer-events: none;
}
</style>

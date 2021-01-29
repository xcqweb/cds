<template>
  <div class="gt-border2" :style="styleObj"/>
</template>
<script>
import baseWidget from "@/mixins/base-widget"
const cname = "GtBorderAnimate2"
export default {
  name: cname,
  mixins: [baseWidget],
  data() {
    return {}
  },
  created() {
    
  },
  methods: {}
}
</script>
<style lang="less" scoped>
.gt-border2 {
  border-radius: 10px;
  overflow: hidden;
  &::before {
    content: "";
    position: absolute;
    z-index: -2;
    left: -50%;
    top: -50%;
    width: 200%;
    height: 200%;
    background-color: #1a232a;
    background-repeat: no-repeat;
    background-position: 0 0;
    background-image: conic-gradient(transparent, #a8efff, transparent 30%);
    animation: rotate 4s linear infinite;
  }
	
	&:after {
    content: "";
    position: absolute;
    z-index: -1;
    left: 6px;
    top: 6px;
    width: calc(100% - 12px);
    height: calc(100% - 12px);
    background: #000;
    border-radius: 5px;
  }

  @keyframes rotate {
    100% {
      transform: rotate(1turn);
    }
  }
}
</style>

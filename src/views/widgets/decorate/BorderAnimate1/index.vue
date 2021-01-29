<template>
  <div class="gt-border1" :style="styleObj"/>
</template>
<script>
import baseWidget from "@/mixins/base-widget"
const cname = "GtBorderAnimate1"
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
.gt-border1 {
	border-radius: 2px;
	overflow: hidden;
  &::before {
		content: '';
		position: absolute;
		z-index: -2;
		left: -50%;
		top: -50%;
		width: 200%;
		height: 200%;
		background-color:transparent;
		background-repeat: no-repeat;
		background-position: 0 0;
		background-image: conic-gradient(transparent, rgba(168, 239, 255, 1), transparent 30%);
		animation: rotate 4s linear infinite;
	}
	
	&::after {
		content: '';
		position: absolute;
		z-index: -1;
		left: 6px;
		top: 6px;
		width: calc(100% - 12px);
		height: calc(100% - 12px);
    border-radius: 5px;
    animation: opacityChange 5s infinite linear;
  }
  @keyframes rotate {
    100% {
      transform: rotate(1turn);
    }
  }
  @keyframes opacityChange {
    50% {
      opacity:.5;
    }
    100% {
      opacity: 1;
    }
  }
}
</style>

<template>
  <div class="loading-con">
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" xml:space="preserve" width="100" height="100">
      <circle fill="none" stroke="#1890ff" stroke-width="6" stroke-miterlimit="15" stroke-dasharray="14.2472,14.2472" cx="50" cy="50" r="47">
        <animateTransform attributeName="transform" attributeType="XML" type="rotate" dur="5s" from="0 50 50" to="360 50 50" repeatCount="indefinite"></animateTransform>
      </circle>
      <circle fill="none" stroke="#1890ff" stroke-width="1" stroke-miterlimit="10" stroke-dasharray="10,10" cx="50" cy="50" r="39">
          <animateTransform attributeName="transform" attributeType="XML" type="rotate" dur="5s" from="0 50 50" to="-360 50 50" repeatCount="indefinite"></animateTransform>
      </circle>
      <g fill="#1890ff">
      <rect x="30" y="35" width="5" height="30">
        <animateTransform attributeName="transform" dur="1s" type="translate" values="0 5 ; 0 -5; 0 5" repeatCount="indefinite" begin="0.1"></animateTransform>
      </rect>
      <rect x="40" y="35" width="5" height="30">
        <animateTransform attributeName="transform" dur="1s" type="translate" values="0 5 ; 0 -5; 0 5" repeatCount="indefinite" begin="0.2"></animateTransform>
      </rect>
      <rect x="50" y="35" width="5" height="30">
        <animateTransform attributeName="transform" dur="1s" type="translate" values="0 5 ; 0 -5; 0 5" repeatCount="indefinite" begin="0.3"></animateTransform>
      </rect>
      <rect x="60" y="35" width="5" height="30">
        <animateTransform attributeName="transform" dur="1s" type="translate" values="0 5 ; 0 -5; 0 5" repeatCount="indefinite" begin="0.4"></animateTransform>
      </rect>
      <rect x="70" y="35" width="5" height="30">
        <animateTransform attributeName="transform" dur="1s" type="translate" values="0 5 ; 0 -5; 0 5" repeatCount="indefinite" begin="0.5"></animateTransform>
      </rect>
      </g>
    </svg>
  </div>
</template>
<script>
export default {
  name:'Loading',
}
</script>
<style lang="less" scoped>
.loading-con{
  position: absolute;
  top: 0;
  left: 0px;
  right: 0px;
  bottom: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background 0.2s ease-in-out 0s;
  background-color: rgb(245, 245, 245);
}
</style>
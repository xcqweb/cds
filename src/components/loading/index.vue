<template>
  <div class="loading-con">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 100 100"
      width="100"
      height="100"
      xml:space="preserve"
    >
      <rect x="20" y="50" width="4" height="10" fill="#1890ff">
        <animateTransform
          attributeType="xml"
          attributeName="transform"
          type="translate"
          values="0 0; 0 20; 0 0"
          begin="0"
          dur="0.6s"
          repeatCount="indefinite"
        ></animateTransform>
      </rect>
      <rect x="30" y="50" width="4" height="10" fill="#1890ff">
        <animateTransform
          attributeType="xml"
          attributeName="transform"
          type="translate"
          values="0 0; 0 20; 0 0"
          begin="0.2s"
          dur="0.6s"
          repeatCount="indefinite"
        ></animateTransform>
      </rect>
      <rect x="40" y="50" width="4" height="10" fill="#1890ff">
        <animateTransform
          attributeType="xml"
          attributeName="transform"
          type="translate"
          values="0 0; 0 20; 0 0"
          begin="0.4s"
          dur="0.6s"
          repeatCount="indefinite"
        ></animateTransform>
      </rect>
    </svg>
  </div>
</template>
<script>
export default {
  name: "Loading"
}
</script>
<style lang="less" scoped>
.loading-con {
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

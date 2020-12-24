export default {
  props: {
    left: { default: "0", type: String },
    top: { default: "0", type: String },
    width: { default: "0", type: String },
    height: { default: "0", type: String }
  },
  data() {
    return {
      styleObj: {}
    }
  },
  created() {
    const tempStyle = {
      // left: parseFloat(this.left) - borderWidth + "px",
      // top: parseFloat(this.top) - borderWidth + "px"
    }
    this.styleObj = {
      ...this.styleObj,
      ...this.$options.propsData,
      ...tempStyle
    }
  }
}

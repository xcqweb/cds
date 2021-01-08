export default {
  props: {
    left: { default: 0, type: String | Number },
    top: { default: 0, type: String | Number },
    width: { default: 0, type: String | Number },
    height: { default: 0, type: String | Number },
    rotate: { default: 0, type: Number },
    zIndex: { default: 5, type: Number },
    text: { default: "", type: String }
  },
  computed: {
    styleObj() {
      return {
        position: "relative",
        width: `${this.width}px`,
        height: `${this.height}px`,
        left: `0`,
        top: `0`,
        transform: `rotate(0deg)`,
        // zIndex: `${this.zIndex}`
      }
    }
  },
  data() {
    return {}
  },
  created() {}
}

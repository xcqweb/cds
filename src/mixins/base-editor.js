export default {
  props: {
    left: { default: 0, type: String | Number },
    top: { default: 0, type: String | Number },
    width: { default: 0, type: String | Number },
    height: { default: 0, type: String | Number },
    rotate: { default: 0, type: Number }
  },
  computed: {
    styleObj() {
      return {
        position: "relative",
        width: `${this.width}px`,
        height: `${this.height}px`,
        left: `0`,
        top: `0`,
        transform: `rotate(0deg)`
      }
    }
  },
  data() {
    return {}
  },
  created() {
  }
}

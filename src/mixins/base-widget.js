export default {
  props: {
    left: { default: 0, type: String | Number },
    top: { default: 0, type: String | Number },
    width: { default: 0, type: String | Number },
    height: { default: 0, type: String | Number },
    rotate: { default: 0, type: Number },
    zIndex: { default: 5, type: Number },
    text: { default: "", type: String },
    cid: { default: "", type: String }
  },
  computed: {
    styleObj: {
      get() {
        const {path} = this.$route
        let preview = false
        if(path.includes('preview-app')) {
          preview = true
        }
        return {
          position: "absolute",
          width: `${this.width}px`,
          height: `${this.height}px`,
          left: preview ? `${this.left}px` : `0`,
          top: preview ? `${this.top}px` : `0`,
          transform: preview ? `rotate(${this.rotate}deg)` : `rotate(0deg)`,
          zIndex: `${this.zIndex}`
        }
      },
      set(val) {
        this.styleObj = val
      }
    }
  },
  data() {
    return {}
  },
  created() {}
}

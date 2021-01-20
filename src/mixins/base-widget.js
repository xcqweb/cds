export default {
  props: {
    left: { default: 0, type: String | Number },
    top: { default: 0, type: String | Number },
    width: { default: 0, type: String | Number },
    height: { default: 0, type: String | Number },
    rotate: { default: 0, type: String | Number },
    zIndex: { default: 5, type: String | Number },
    text: { default: "", type: String },
    cid: { default: "", type: String },
    backgroundColor: { default: "", type: String },
    arrow: { default: "", type: String },
    linkUrl: { default: "", type: String },
    imgSrc: { default: "", type: String },
    color: { default: "", type: String },
    borderColor: { default: "", type: String },
    borderStyle: { default: "", type: String },
    borderWidth: { default: "", type: String | Number },
    backgroundImage: { default: "", type: String },
    justifyContent: { default: "", type: String },
    alignItems: { default: "", type: String },
    fontWeight: { default: "", type: String | Boolean },
    fontSize: { default: "", type: String | Number },
    fontFamily: { default: "", type: String },
    opacity: { default: "", type: String | Number },
    visible: { default: "", type: String | Boolean },
    borderRadius: { default: "", type: String | Number },
    isPreview: { default: false, type: Boolean }
  },
  computed: {
    styleObj: {
      get() {
        return {
          position: "absolute",
          width: `${this.width}px`,
          height: `${this.height}px`,
          left: `0`,
          top: `0`,
          transform: `rotate(0deg)`,
          zIndex: `${this.zIndex}`,
          opacity: this.opacity
        }
      },
      set(val) {
        console.log("set--style-base---------", val)
        this.styleObj = val
      }
    }
  },
  data() {
    return {}
  },
  created() {}
}

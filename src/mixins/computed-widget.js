export default {
  computed: {
    currentPageIndex() {
      return this.$store.getters["currentPageIndex"]
    },
    currentWidget() {
      return this.$store.getters["currentWidget"]
    },
    currentWidgetIndex() {
      return this.$store.getters["currentWidgetIndex"]
    }
  },
  data() {
    return {}
  },
  created() {}
}

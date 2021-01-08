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
    },
    currentPage() {
      return this.$store.getters["currentPage"]
    },
    selectWidgets() {
      return this.$store.getters["selectWidgets"]
    },
    showHelpLine() {
      return this.$store.getters["showHelpLine"]
    },
  }
}

export default {
  computed: {
    currentPageIndex() {
      return this.$store.getters["currentPageIndex"]
    },
    currentWidget() {
      console.log(this.$store.getters["currentWidget"])
      return null
      if(this.$store.getters["currentWidget"] ==undefined || Object.keys(this.$store.getters["currentWidget"]).length === 0) {
        return null
      }
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
    }
  }
}

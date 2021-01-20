import {findWidgetById} from '@u/deal'
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
    cname() {
      let res = ""
      if (this.selectWidgets.length) {
        res = this.selectWidgets[0].cname
      }
      return res
    },
    attrs: {
      get() {
        let attrs = {}
        if (this.selectWidgets.length == 1) {
          attrs = this.selectWidgets[0].attrs
        } else {
          const textEditor = this.$store.state.textEditorShow
          if(textEditor.show) {
            attrs = findWidgetById(this.$store.getters.currentPage.widgets,textEditor.cid).attrs
          }
        }
        return attrs
      }
    }
  }
}

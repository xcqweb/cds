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
    textEditor() {
      return this.$store.state.textEditor
    },
    operateWidget() {
      if (this.currentWidget) {
        return this.currentWidget
      }
      let res = findWidgetById(this.currentPage.widgets,this.textEditor.widget.cid)
      return res
    },
    cname() {
      let res = ""
      if (this.operateWidget) {
        res = this.operateWidget.cname
      }
      return res
    },
    attrs: {
      get() {
        let attrs = {}
        if (this.operateWidget) {
          attrs = this.operateWidget.attrs
        }
        return attrs
      }
    }
  }
}

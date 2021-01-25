import helpComputed from "@/mixins/help-computed"
import helpMethods from "@/mixins/help-methods"
import config from "@/config"
import { isGroup, findWidgetChildren } from "@u/deal"
import { uuid } from "@u/uuid"
export default {
  mixins: [helpMethods, helpComputed],
  methods: {
    group( ) {
      let widgets = this.selectWidgets
      const cname = config.groupName
      const name = `组合`
      const attrs = this.calculateSelectWidgets(widgets)
      widgets.forEach(item => {
        if (isGroup(item)) {
          this.ungroup(null, item)
        }
      })
      widgets = this.selectWidgets
      const cid = uuid(16, 16)
      widgets.forEach(item => {
        this.$store.commit("updateWidget", {
          pid: cid,
          active: false,
          cid: item.cid
        })
      })
      this.$store.commit("widgetAdd", { cid, cname, name, ...attrs })
    },
    ungroup(evt, widget) {
      if (!widget) {
        widget = this.currentWidget
      }
      if (isGroup(widget)) {
        const childWidgets = findWidgetChildren(
          this.currentPage.widgets,
          widget.cid
        )
        childWidgets.forEach(item => {
          let { left, top } = widget.attrs
          this.$store.commit("updateWidget", {
            pid: "",
            cid: item.cid,
            active: true
          })
        })
        this.$store.commit("widgetDel", [widget])
      }
    },
    toTop() {
      this.$store.commit("zIndexOperate", "toTop")
    },
    toBottom() {
      this.$store.commit("zIndexOperate", "toBottom")
    },
    nextZIndex() {
      this.$store.commit("zIndexOperate", "nextZIndex")
    },
    lastZIndex() {
      this.$store.commit("zIndexOperate", "lastZIndex")
    }
  }
}

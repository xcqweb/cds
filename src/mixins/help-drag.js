import undoManager from "@u/undo-manager"
export default {
  methods: {
    onRotate(rotate) {
      this.$store.commit("updateWidgetAttrs", {
        rotate,
        cid: this.widget.cid
      })
      this.updateHint(true, `${rotate}`)
    },
    onResizeStop() {
      undoManager.saveApplyChange()
      this.updateHint(false, "")
    },
    onRotateStop() {
      undoManager.saveApplyChange()
      this.updateHint(false, "")
    },
    onDragStop() {
      undoManager.saveApplyChange()
      this.updateHint(false, "")
      this.$store.commit("setShowHelpLine", false)
    },
    onActivated() {
      this.$store.commit("setCurrentWidgetId", this.widget.cid)
      this.$store.commit("updateWidget", { active: true, cid: this.widget.cid })
      undoManager.saveApplyChange()
    },
    onDeactivated() {
      this.$store.commit("setCurrentWidgetId", "")
      this.$store.commit("updateWidget", {
        active: false,
        cid: this.widget.cid
      })
    },
    updateHint(show, text) {
      this.$store.commit("setHint", { show, text })
    }
  }
}

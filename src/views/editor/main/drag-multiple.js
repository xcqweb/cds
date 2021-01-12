export default {
  mounted() {
    window.addEventListener("keydown", ev => {
      if (ev.keyCode === 17) {
        this.sync = true
        console.log(this.sync)
      }
    })
    window.addEventListener("keyup", ev => {
      if (ev.keyCode === 17) {
        this.sync = false
        console.log(this.sync)
      }
    })
  },
  methods: {
    dragging(id, left, top) {
      console.log(this.draggingId, id)
      this.draggingId = id

      if (!this.sync) return

      const offsetX = left - this.draggingElement.x
      const offsetY = top - this.draggingElement.y

      const deltaX = this.deltaX(offsetX)
      const deltaY = this.deltaY(offsetY)
      console.log(offsetX, offsetY, this.elements.length)

      this.elements.map(el => {
        if (el.cid !== id) {
          el.x += deltaX
          el.y += deltaY
        }
        console.log(111)

        return el
      })
    },
    dragstop(id, left, top) {
      this.elements.map(el => {
        if (el.cid === id) {
          el.x = left
          el.y = top
        }

        return el
      })

      this.draggingId = null
      this.prevOffsetX = 0
      this.prevOffsetY = 0
      this.sync = false
    },
    deltaX(offsetX) {
      const ret = offsetX - this.prevOffsetX

      this.prevOffsetX = offsetX

      return ret
    },
    deltaY(offsetY) {
      const ret = offsetY - this.prevOffsetY

      this.prevOffsetY = offsetY

      return ret
    }
  },
  computed: {
    draggingElement: function() {
      if (!this.draggingId) return
      return this.elements.find(el => el.cid === this.draggingId)
    },
    elements() {
      console.log(this.$store.getters.activeItems)
      return this.$store.getters.activeItems
    }
  }
}

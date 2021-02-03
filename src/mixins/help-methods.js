import { dealRotatePos } from "@u/deal"
export default {
  methods: {
    calculateSelectWidgets(selectWidgets) {
      let minX = 10000,
        minY = 10000,
        maxX = 0,
        maxY = 0
        // maxZIndex = 0
      selectWidgets.forEach(item => {
        let { left, top, width, height } = dealRotatePos(item.attrs)
        minX = Math.min(left, minX)
        minY = Math.min(top, minY)
        maxX = Math.max(left + width, maxX)
        maxY = Math.max(top + height, maxY)
        // maxZIndex = Math.max(zIndex, maxZIndex)
      })
      return {
        left: minX,
        top: minY,
        right: maxX,
        bottom: maxY,
        width: maxX - minX,
        height: maxY - minY,
        // zIndex: maxZIndex,
        centerX: minX + (maxX - minX) / 2,
        centerY: minY + (maxY - minY) / 2
      }
    }
  }
}

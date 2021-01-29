<template>
  <div
    class="group-item"
    :style="styleObj"
    @click="click"
    @dblclick="dblclick"
    @mouseenter="mouseenter"
    @mousemove="mousemove"
    @mouseleave="mouseleave"
  >
    <component
      :is="widget.cname"
      v-bind="widget.attrs"
      :text="widget.text"
      :is-preview="true"
    >
      <template v-if="widget.children">
        <widget-item
          v-for="item in widget.children"
          :pwidget="widget"
          :key="item.cid"
          :widget="item"
        />
      </template>
    </component>
  </div>
</template>

<script>
import components from "@/views/widgets/index"

export default {
  name: "WidgetItem",
  components: {
    ...components
  },
  props: {
    widget: Object,
    pwidget: Object, // 父控件
    actionList: Array
  },
  computed: {
    pages() {
      return this.$store.state.preview.pages
    },
    frameShow() {
      return this.$store.state.preview.frameContent.show
    }
  },
  data() {
    return {
      styleObj: {}
    }
  },
  created() {
    let { width, height, left, top, rotate } = this.widget.attrs
    if (this.pwidget) {
      const { left: pleft, top: ptop } = this.pwidget.attrs
      left = left - pleft
      top = top - ptop
    }
    this.styleObj = {
      width: `${width}px`,
      height: `${height}px`,
      left: `${left}px`,
      top: `${top}px`,
      transform: `rotate(${rotate}deg)`,
      zIndex: "auto"
    }
    if (this.actionList) {
      this.styleObj.cursor = "pointer"
    }
    console.log(this.widget,"a---")
  },
  methods: {
    click() {
      clearTimeout(this.timer) // 同一元素 同时绑定单击和双击事件
      this.timer = setTimeout(() => {
        const eventList = this.filterEventTypeList("click")
        this.dealEvent(eventList)
      }, 200)
    },
    dblclick() {
      clearTimeout(this.timer)
      const eventList = this.filterEventTypeList("dbclick")
      this.dealEvent(eventList)
    },
    filterEventTypeList(type) {
      let res = []
      if (this.actionList) {
        res = this.actionList.filter(item => item.eventType === type)
      }
      return res
    },
    dealEvent(eventList) {
      let page
      eventList.forEach(item => {
        switch (item.actionType) {
          case "link-page":
            page = this.pages.find(p => p.pageId === item.content.pageId)
            if (page) {
              this.$store.commit("preview/setCurrentPage", page)
            }
            break
          case "show-hide-widget":
            this.changeWidgetVisible(item.content)
            break
          case "open-link":
            this.openLink(item.content)
            break
        }
      })
    },
    changeWidgetVisible(content) {},
    openLink(content) {
      const { openWay, linkUrl } = content
      window.open(linkUrl, openWay)
    },
    mouseenter(evt) {
      const texts = this.widget.frameTexts
      if (texts && !this.frameShow) {
        const { x, y } = evt
        this.$store.commit("preview/setFrameContent", {
          texts,
          show: true,
          pos: { x, y }
        })
      }
    },
    mousemove(evt) {
      if (this.frameShow) {
        const { x, y } = evt
        this.$store.commit("preview/setFrameContent", { pos: { x, y } })
      }
    },
    mouseleave() {
      if (this.frameShow) {
        this.$store.commit("preview/setFrameContent", { show: false })
      }
    }
  }
}
</script>
<style lang="less" scoped>
.group-item {
  position: absolute;
}
</style>

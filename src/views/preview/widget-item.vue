<template>
  <div class="group-item" :style="styleObj" @click="click" @dblclick="dblclick">
    <component
      :is="widget.cname"
      v-bind="widget.attrs"
      :text="widget.text"
      :is-preview="true"
    >
      <template v-if="widget.children">
        <widget-item
          v-for="item in widget.children"
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
    actionList: Array
  },
  data() {
    return {
      styleObj: {}
    }
  },
  created() {
    const { width, height, left, top, rotate } = this.widget.attrs
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
    console.log(this.actionList)
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
      eventList.forEach(item => {
        switch (item.actionType) {
          case "link-page":
            console.log("---changepage--")
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
    openLink(content) {}
  }
}
</script>
<style lang="less" scoped>
.group-item {
  position: absolute;
}
</style>

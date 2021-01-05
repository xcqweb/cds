<template>
  <div>
    <div class="fs ge-h40">
      <label>组件名</label>
      <a-input :value="name" @change="setName" placeholder="Basic usage" />
    </div>
    <div class="fs ge-h40">
      <label>X</label>
      <a-input :value="left" @change="setLeft" placeholder="Basic usage" />
    </div>
    <div class="fs ge-h40">
      <label>Y</label>
      <a-input :value="top" @change="setTop" placeholder="Basic usage" />
    </div>
    <div class="fs ge-h40">
      <label>width</label>
      <a-input :value="width" @change="setWidth" placeholder="Basic usage" />
    </div>
    <div class="fs ge-h40">
      <label>height</label>
      <a-input :value="height" @change="setHeight" placeholder="Basic usage" />
    </div>
  </div>
</template>

<script>
import computedWidget from "@/mixins/computed-widget"
export default {
  name: "name-position",
  mixins: [computedWidget],
  data() {
    return {}
  },
  computed: {
    name() {
      return this.currentWidget === null ||
        (this.currentWidget === undefined && this.currentWidgetIndex === -1)
        ? ""
        : this.$store.state.apply.pages[this.currentPageIndex].widgets[
            this.currentWidgetIndex
          ].name
    },
    width() {
      return this.currentWidget === null ||
        (this.currentWidget === undefined && this.currentWidgetIndex === -1)
        ? ""
        : this.$store.state.apply.pages[this.currentPageIndex].widgets[
            this.currentWidgetIndex
          ].attrs.width
    },
    height() {
      return this.currentWidget === null ||
        (this.currentWidget === undefined && this.currentWidgetIndex === -1)
        ? ""
        : this.$store.state.apply.pages[this.currentPageIndex].widgets[
            this.currentWidgetIndex
          ].attrs.height
    },
    top() {
      return this.currentWidget === null ||
        (this.currentWidget === undefined && this.currentWidgetIndex === -1)
        ? ""
        : this.$store.state.apply.pages[this.currentPageIndex].widgets[
            this.currentWidgetIndex
          ].attrs.top
    },
    left() {
      return this.currentWidget === null ||
        (this.currentWidget === undefined && this.currentWidgetIndex === -1)
        ? ""
        : this.$store.state.apply.pages[this.currentPageIndex].widgets[
            this.currentWidgetIndex
          ].attrs.left
    }
  },
  methods: {
    setName(ev) {
      let value = ev.target.value
      if (value) {
        ev.target.value = value
        this.$store.commit("setName", value)
      }
    },
    setLeft(ev) {
      let value = parseInt(ev.target.value)
      if (typeof value !== "number" || isNaN(value)) {
        value = this.$store.state.apply.pages[this.currentPageIndex].widgets[
          this.currentWidgetIndex
        ].attrs.left
        ev.target.value = value
      }
      this.$store.commit("setLeft", value)
    },
    setTop(ev) {
      let value = parseInt(ev.target.value)
      if (typeof value !== "number" || isNaN(value)) {
        value = this.$store.state.apply.pages[this.currentPageIndex].widgets[
          this.currentWidgetIndex
        ].attrs.top
        ev.target.value = value
      }
      this.$store.commit("setTop", value)
    },
    setWidth(ev) {
      let value = parseInt(ev.target.value)
      if (typeof value !== "number" || isNaN(value)) {
        value = this.$store.state.apply.pages[this.currentPageIndex].widgets[
          this.currentWidgetIndex
        ].attrs.width
        ev.target.value = value
      }
      this.$store.commit("setWidth", value)
    },
    setHeight(ev) {
      let value = parseInt(ev.target.value)
      if (typeof value !== "number" || isNaN(value)) {
        value = this.$store.state.apply.pages[this.currentPageIndex].widgets[
          this.currentWidgetIndex
        ].attrs.height
        ev.target.value = value
      }
      this.$store.commit("setHeight", value)
    }
  }
}
</script>

<style scoped>
.fs {
  display: flex;
  justify-content: space-between;
}
.ge-h40 {
  height: 40px;
  line-height: 40px;
}
label {
  width: 80px;
  text-align: center;
}
.ge-border {
  border-bottom: 1px solid #323a3e;
}
</style>

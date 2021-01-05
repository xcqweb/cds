<template>
  <div class="ge-border">
    <div class="fs ge-h40">
      <label>内容</label>
      <a-input
        class="ge-lg40"
        :value="content"
        @change="setCurrentContent"
        placeholder="Basic usage"
      />
    </div>
  </div>
</template>

<script>
import computedWidget from "@/mixins/computed-widget"
export default {
  name: "text-content",
  props: {},
  mixins: [computedWidget],
  data() {
    return {
      textContent: ""
    }
  },
  computed: {
    content() {
      return this.currentWidget === null ||
        (this.currentWidget === undefined && this.currentWidgetIndex === -1)
        ? ""
        : this.$store.state.apply.pages[this.currentPageIndex].widgets[
            this.currentWidgetIndex
          ].attrs.content
    }
  },
  watch: {},
  methods: {
    setCurrentContent(ev) {
      let value = ev.target.value
      if (value) {
        ev.target.value = value
        this.$store.commit("setCurrentContent", value)
      }
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
.ge-lg40 {
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

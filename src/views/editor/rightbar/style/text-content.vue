<template>
  <div class="ge-border">
    <div class="fs pdt5 pdr10 pdb5">
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
import helpComputed from "@/mixins/help-computed"
export default {
  name: "text-content",
  props: {},
  mixins: [helpComputed],
  data() {
    return {}
  },
  computed: {
    content() {
      return this.currentWidget === null ||
        (Object.keys(this.currentWidget).length === 0 &&
          this.currentWidgetIndex === -1)
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
        this.$store.commit("setCurrentContent", value)
      }
    }
  }
}
</script>

<style scoped>
.ge-h50 {
  height: 50px;
  line-height: 50px;
}
.ge-lg40 {
  line-height: 40px;
}
label {
  width: 48px;
  height: 35px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #040c2c;
  line-height: 35px;
  margin-left: 10px;
}
</style>

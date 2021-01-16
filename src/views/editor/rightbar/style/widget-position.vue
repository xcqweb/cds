<template>
  <div class="widget-position-con">
    <div class="item-con">
      <div class="input-con fs">
        <a-input
          size="small"
          v-model.number="attrs.left"
          type="number"
          suffix="X"
          style="width: 40%"
        />
        <a-input
          size="small"
          v-model.number="attrs.top"
          type="number"
          suffix="Y"
          style="width: 40%"
        />
      </div>
      <div class="input-con fs">
        <a-input
          size="small"
          v-model.number="attrs.width"
          type="number"
          suffix="W"
          style="width: 40%"
        />
        <a-input
          size="small"
          v-model.number="attrs.height"
          type="number"
          suffix="H"
          style="width: 40%"
        />
      </div>
      <div class="input-con fs">
        <a-input
          size="small"
          v-model.number="attrs.rotate"
          type="number"
          suffix="R"
          style="width: 40%"
        />
        <a-input
          size="small"
          v-model.number="attrs.borderRadius"
          type="number"
          suffix="C"
          style="width: 40%"
        />
      </div>
    </div>
  </div>
</template>
<script>
import helpComputed from "@/mixins/help-computed"
export default {
  name: "WidgetPosition",
  mixins: [helpComputed],
  data() {
    return {}
  },
  methods: {}
}
</script>
<style lang="less" scoped>
.widget-position-con {
  width: 100%;
  .input-con {
    margin-bottom: 10px;
  }
}
</style>

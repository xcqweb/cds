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
          :disabled="cname == 'GtLine'"
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
          v-if="cname == 'GtRect'"
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
import key from "keymaster"
const keyList = ["up", "right", "down", "left"]
export default {
  name: "WidgetPosition",
  mixins: [helpComputed],
  data() {
    return {}
  },
  mounted() {
    keyList.forEach(kbd => {
      key(kbd, evt => this.dealKbd(kbd, evt))
    })
  },
  beforeDestroy() {
    keyList.forEach(kbd => {
      key.unbind(kbd)
    })
  },
  methods: {
    dealKbd(kbd, evt) {
      evt.preventDefault()
      if (this.selectWidgets.length) {
        let disLeft = 0
        let disTop = 0
        switch (kbd) {
          case "up":
            disTop = -1
            break
          case "right":
            disLeft = 1
            break
          case "down":
            disTop = 1
            break
          case "left":
            disLeft = -1
            break
        }
        this.selectWidgets.forEach(item => {
          this.$store.commit("updateWidgetAttrs", {
            left: item.attrs.left + disLeft,
            top: item.attrs.top + disTop,
            cid: item.cid
          })
        })
      }
    }
  }
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

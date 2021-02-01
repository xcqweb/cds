<template>
  <div class="widget-position-con">
    <div class="item-con">
      <div class="fv" :class="{'input-con':show}">
        <a-input
          size="small"
          v-model.number="attrs.left"
          suffix="X"
          style="width: 30%;margin-right:5%;"
        />
        <a-input
          size="small"
          v-model.number="attrs.top"
          suffix="Y"
          style="width: 30%;margin-right:5%;"
        />
        <a-input
          v-if="show" 
          size="small"
          v-model.number="attrs.rotate"
          suffix="R"
          style="width: 30%;"
        />
      </div>
      <div class="input-con fv" v-if="show" style="margin-bottom:0;">
        <a-input
          size="small"
          v-model.number="attrs.width"
          suffix="W"
          style="width: 30%;margin-right:5%;"
        />
        <a-input
          size="small"
          v-model.number="attrs.height"
          suffix="H"
          style="width: 30%;margin-right:5%;"
        />
         <a-input
          v-if="cname == 'GtRect'"
          size="small"
          v-model.number="attrs.borderRadius"
          suffix="C"
          style="width: 30%"
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
  computed: {
    show() {
      const widgetNames = ["GtLine"]
      return !widgetNames.includes(this.cname)
    }
  },
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

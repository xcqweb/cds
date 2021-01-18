<template>
  <div class="link-style-con" v-if="cname == 'GtLink'">
    <div class="item-con">
      <label class="label-block">连接地址</label>
      <a-textarea
        placeholder="请输入连接地址"
        :rows="3"
        style="resize:none;"
        v-model="attrs.linkUrl"
      />
    </div>
  </div>
</template>
<script>
import helpComputed from "@/mixins/help-computed"
export default {
  name: "LinkStyle",
  mixins: [helpComputed],
  data() {
    return {}
  },
  methods: {}
}
</script>
<style lang="less" scoped>
.link-style-con {
}
</style>

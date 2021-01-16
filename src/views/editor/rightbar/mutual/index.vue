<template>
  <div class="mutual-con">
    <div class="item-con" @click="addAction">
      <svg-icon icon-class="add" class-name="mutual-icon" />
      <span style="margin-left:10px;">添加交互事件</span>
    </div>
    <div class="mutual-list">
      <mutual-item
        v-for="item in mutualList"
        :key="item.actionId"
        :action="item"
        @queryMutualList="queryMutualList"
      />
    </div>
  </div>
</template>

<script>
import mutualApi from "@a/mutual"
import MutualItem from "./mutual-item"
import helpComputed from "@/mixins/help-computed"
export default {
  name: "Mutual",
  mixins: [helpComputed],
  components: {
    MutualItem
  },
  data() {
    return {
      mutualList: []
    }
  },
  computed: {},
  created() {
    this.queryMutualList()
  },
  mounted() {},
  methods: {
    queryMutualList() {
      console.log("a--b--")
      if (this.selectWidgets.length) {
        mutualApi.list({ widgetId: this.selectWidgets[0].cid }).then(res => {
          if (res.code == 0) {
            if (res.data.length) {
              this.mutualList = res.data
            }
          }
        })
      }
    },
    addAction() {
      const len = this.mutualList.length + 1
      const params = {
        actionName: `交互 ${len}`,
        widgetId: this.selectWidgets[0].cid,
        eventType: "click",
        actionTye: "link-page",
        content: {
          pageId: ""
        }
      }
      this.mutualList.push(params)
      mutualApi.add(params).then(res => {
        console.log(res, "新增交互")
      })
    }
  }
}
</script>
<style lang="less" scoped>
.mutual-con {
  width: 100%;
  position: relative;
  color: #040c2c;
  .mutual-icon {
    cursor: pointer;
    font-size: 12px;
  }
  .mutual-list {
    padding: 0 10px;
  }
}
</style>

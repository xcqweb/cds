<template>
  <div class="mutual-item-action">
    <div class="item-action fs">
      <a-input
        size="small"
        v-model="action.actionName"
        type="text"
        style="width:70%;"
        @blur.native="saveAction"
      />
      <svg-icon
        icon-class="delete"
        style="color:#333;cursor:pointer;"
        @click.native="delAction"
      />
    </div>
    <div class="item-action fs">
      <label>事件</label>
      <a-select
        size="small"
        v-model="action.eventType"
        style="width:80%;"
        class="style-con"
        @blur.native="saveAction"
      >
        <a-select-option
          v-for="item in eventList"
          :key="item.value"
          :value="item.value"
        >
          {{ item.label }}
        </a-select-option>
      </a-select>
    </div>
    <div class="item-action fs">
      <label>动作</label>
      <a-select
        size="small"
        style="width:80%;"
        class="style-con"
        v-model="action.actionType"
        @blur.native="saveAction"
      >
        <a-select-option
          v-for="item in actionList"
          :key="item.value"
          :value="item.value"
        >
          {{ item.label }}
        </a-select-option>
      </a-select>
    </div>
    <div class="item-action fs" v-if="action.actionType == 'link-page'">
      <label>页面</label>
      <a-cascader
        :options="pages"
        placeholder="选择跳转的页面"
        :fieldNames="{
          label: 'pageName',
          value: 'pageId',
          children: 'children'
        }"
        style="width:80%;"
        size="small"
        @blur.native="saveAction"
        v-model="action.content.pageId"
      />
    </div>
    <div class="item-action fs" v-if="action.actionType == 'show-hide-widget'">
      <label>显示</label>
      <a-select
        v-model="action.content.showWidgetId"
        size="small"
        style="width:80%;"
      >
        <a-select-option
          v-for="item in widgets"
          :key="item.cid"
          :value="item.cid"
          placeholder="请选择"
          @blur.native="saveAction"
        >
          {{ item.name }}
        </a-select-option>
      </a-select>
    </div>
    <div class="item-action fs" v-if="action.actionType == 'show-hide-widget'">
      <label>隐藏</label>
      <a-select
        v-model="action.content.hideWidgetId"
        size="small"
        style="width:80%;"
      >
        <a-select-option
          v-for="item in widgets"
          :key="item.cid"
          :value="item.cid"
          placeholder="请选择"
          @blur.native="saveAction"
        >
          {{ item.name }}
        </a-select-option>
      </a-select>
    </div>
    <div class="item-action fs" v-if="action.actionType == 'open-link'">
      <label>方式</label>
      <a-select
        v-model="action.content.openWay"
        size="small"
        style="width:80%;"
      >
        <a-select-option
          v-for="item in openListWayList"
          :key="item.value"
          :value="item.value"
          @blur.native="saveAction"
        >
          {{ item.label }}
        </a-select-option>
      </a-select>
    </div>
    <div class="item-action" v-if="action.actionType == 'open-link'">
      <label style="display:block;margin-bottom:6px;">输入连接</label>
      <a-textarea
        placeholder="请输入连接地址"
        :rows="3"
        style="resize:none;"
        v-model="action.content.linkUrl"
        @blur.native="saveAction"
      />
    </div>
  </div>
</template>
<script>
import api from "@a/mutual"
import config from "@/config"
import arrayToTree from "array-to-tree"
import helpComputed from "@/mixins/help-computed"
import { cloneDeep } from "lodash"
export default {
  name: "MutualItem",
  mixins: [helpComputed],
  props: {
    action: Object
  },
  computed: {
    pages() {
      let pages = this.$store.state.apply.pages
      pages = arrayToTree(pages, { parentProperty: "pid", customID: "pageId" })
      return pages
    },
    widgets() {
      let res = []
      if (this.currentPage) {
        res = this.currentPage.widgets
      }
      return res
    }
  },
  data() {
    return {
      eventList: config.eventList,
      actionList: config.actionList,
      openListWayList: config.openListWayList
    }
  },
  created() {
    this.action.content.pageId = [this.action.content.pageId]
  },
  methods: {
    delAction() {
      this.$confirm({
        title: "提示",
        content: `确定要删除该交互吗？`,
        onOk: () => {
          api.del(this.action.actionId).then(res => {
            if (res.code === 0) {
              this.$message.success("删除交互成功")
              this.$emit("queryMutualList")
            }
          })
        }
      })
    },
    saveAction() {
      const params = cloneDeep(this.action)
      const arr = params.content.pageId
      if (arr) {
        const len = arr.length
        if (len == 1) {
          params.content.pageId = arr[0]
        } else {
          params.content.pageId = arr[1]
        }
      }
      api.edit(params).then(res => {
        if (res.code === 0) {
          console.log("保存交互成功")
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.mutual-item-action {
  background: #f7f7f8;
  border-radius: 2px;
  margin-top: 10px;
  .item-action {
    padding: 9px 10px;
  }
}
</style>

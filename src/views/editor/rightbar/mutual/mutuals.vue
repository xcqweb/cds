<template>
  <div class="mutuals">
    <div class="m-content">
      <a class="jZTldN" @click="add">
        <svg-icon icon-class="add" class-name="side-nav-icon" />
        <span>添加交互事件</span>
      </a>
      <ol v-if="data.length" class="link-list">
        <div class="link-content" v-for="(obj, index) in data" :key="index">
          <div class="link-header fs">
            <span class="link-title">交互{{ index }}</span>
            <a class="action" @click="del(obj)">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="svg-icon design/trash"
                viewBox="0 0 12 12"
                aria-hidden="true"
              >
                <path
                  d="M2 3.5h8v7a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-7zm2.5 2A.5.5 0 0 0 4 6v3a.5.5 0 0 0 1 0V6a.5.5 0 0 0-.5-.5zm3 0A.5.5 0 0 0 7 6v3a.5.5 0 0 0 1 0V6a.5.5 0 0 0-.5-.5zM5 1a.5.5 0 0 1 .5-.5h1A.5.5 0 0 1 7 1a.5.5 0 0 0 .5.5h3a.5.5 0 1 1 0 1h-9a.5.5 0 0 1 0-1h3A.5.5 0 0 0 5 1z"
                ></path></svg
            ></a>
          </div>
          <div class="link-header mgb10 fs">
            <span class="link-title">事件</span>
            <div v-if="!_isMobile">
              <a-select
                mode="default"
                v-model="obj.content.eventValue"
                placeholder="选择事件"
                @change="e => edit(e, 'event', obj)"
              >
                <a-select-option v-for="item in eventPC" :key="item.value">
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </div>
            <div v-else>
              <a-select
                mode="default"
                v-model="obj.content.eventValue"
                placeholder="选择事件"
                @change="e => edit(e, 'event', obj)"
              >
                <a-select-option v-for="item in eventPh" :key="item.value">
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </div>
          </div>

          <div class="link-header mgb10 fs">
            <span class="link-title">动作</span>
            <a-select
              mode="default"
              v-model="obj.content.actionValue"
              placeholder="选择动作"
              @change="e => edit(e, 'action', obj)"
            >
              <a-select-option v-for="item in actions" :key="item.value">
                {{ item.label }}
              </a-select-option>
            </a-select>
          </div>

          <div class="link-header mgb10 fs">
            <span class="link-title">页面</span>
            <a-cascader
              :options="pages"
              :default-value="obj.content.pageIds"
              :fieldNames="fieldNames"
              placeholder="选择页面"
              @change="e => edit(e, 'page', obj)"
            />
          </div>
          <div v-if="obj.content.actionValue == 'blank'">
            <div class="link-header">
              <span class="link-title">输入链接</span>
            </div>
            <div class="way-texta">
              <a-textarea
                class="link"
                @blur="e => edit(e, 'input', obj)"
                v-model="obj.content.hrefValue"
                placeholder="请输入链接"
                :auto-size="{ minRows: 3, maxRows: 5 }"
              />
            </div>
          </div>
        </div>
      </ol>
      <div v-else class="bHaNhk">
        <img :src="imgUrl" />
        <p class="tips">快去创建链接，让您的原型动起来吧！</p>
      </div>
    </div>
  </div>
</template>

<script>
import mutualsApi from "@a/mutuals"
import arrayToTree from "array-to-tree"
const no_links_light = require("@/assets/images/no_links_light.png")
export default {
  name: "mutuals",
  components: {},
  data() {
    return {
      imgUrl: no_links_light,
      data: [],
      defaultValue: [],
      fieldNames: { label: "pageName", value: "pageId", children: "children" },
      eventPC: [
        {
          value: "click",
          label: "点击"
        },
        {
          value: "dbClick",
          label: "双击"
        }
      ],
      eventPh: [
        {
          value: "click",
          label: "点击"
        },
        {
          value: "dbClick",
          label: "双击"
        },
        {
          value: "leftTouch",
          label: "左滑"
        },
        {
          value: "rightTouch",
          label: "右滑"
        },
        {
          value: "topTouch",
          label: "上滑"
        },
        {
          value: "bottomTouch",
          label: "下滑"
        }
      ],
      actions: [
        {
          value: "jump",
          label: "跳转页面"
        },
        {
          value: "visible",
          label: "显隐组件"
        },
        {
          value: "blank",
          label: "打开链接"
        }
      ],
      activeKey: []
    }
  },
  computed: {
    currentWidget() {
      return this.$store.getters["currentWidget"]
    },
    pages() {
      let pages = this.$store.state.apply.pages
      pages = arrayToTree(pages, { parentProperty: "pid", customID: "pageId" })
      pages.map(el => {
        if (el.children) {
          el.children.unshift({
            pageId: "all",
            pageName: "全部"
          })
        }
      })
      return pages
    },
    _isMobile() {
      let flag = navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
      )
      return flag
    }
  },
  watch: {
    data(val) {
      if (!val.length) {
        this.add()
      }
    }
  },
  created() {
    this.getList()
  },
  mounted() {},
  methods: {
    getList() {
      let widgetId = this.currentWidget.cid
      mutualsApi.queryAll({ widgetId }).then(res => {
        if (res.code === 0) {
          this.data = res.data
        }
      })
    },
    del(obj) {
      let actionIds = obj.actionId
      mutualsApi.del(actionIds).then(res => {
        if (res.code === 0) {
          this.getList()
        }
      })
    },
    edit(e, type, obj) {
      let content = obj.content
      switch (type) {
        case "event":
          content.eventValue = e
          break
        case "action":
          content.actionValue = e
          break
        case "input":
          content.hrefValue = e
          break
        case "page":
          content.pageIds = e
          break
      }
      let params = {}
      console.log(content)
      params = { ...obj, content }
      mutualsApi.edit(params).then(res => {
        if (res.code === 0) {
          this.getList()
          this.$message.success("修改成功")
        }
      })
    },
    add() {
      let params = {
        actionId: "",
        actionType: "",
        content: {
          pageIds: [this.pages[0].pageId, "all"],
          actionValue: "jump",
          eventValue: "click",
          hrefValue: ""
        },
        widgetId: this.currentWidget.cid
      }
      mutualsApi.add(params).then(res => {
        if (res.code === 0) {
          this.getList()
          this.$message.success("新增成功")
        }
      })
    },
    change(key) {
      console.log(key)
    }
  }
}
</script>
<style></style>
<style lang="less">

.mutuals {
  width: 230px;
  display: flex;
  flex-direction: column;
  flex: 1 1 0%;
  overflow: hidden;
  font-size: 12px;
  .fs{
    display: flex;
    justify-content: space-between;
    align-items: center;
  } 
   .mgb10 {
     margin-bottom: 10px;
   }
  .m-content {
    height: calc(100% - 36px);
    padding: 0px 9px;
  }
  .link-list {
    height: calc(80vh - 50px);
    overflow: hidden auto;
    width: 212px;
    margin-bottom: 13px;
    border-radius: 2px;
    transition: all 0.2s ease-in-out 0s;
    .link-content {
      padding: 10px 5px 10px;
      background-color: rgb(245, 245, 245);
      margin-bottom: 10px;
      .link-header {
        height: 31px;
        padding: 0px 7px 10px 10px;
      }
      .link-title {
        height: 18px;
        line-height: 18px;
        color: rgb(91, 107, 115);
      }
    }
    .ant-select-selection,
    .ant-cascader-input.ant-input {
      width: 142px;
      height: 30px;
      background: #ffffff;
      border-radius: 2px;
      border: 1px solid #f0f1f3;
    }
    .link {
      width: 190px;
      height: 69px;
      background: #ffffff;
      border-radius: 2px;
      border: 1px solid #f0f1f3;
    }
    .way-texta {
      padding: 0px 7px 0px 10px;
    }
  }
  .jZTldN {
    height: 18px;
    display: flex;
    color: #040c2c;
    margin-bottom: 10px;
    border-radius: 2px;
    span {
      margin-left: 8px;
    }
    span:hover,
    span:active {
      color: #1740dc;
    }
  }
  .bHaNhk {
    display: flex;
    flex-direction: column;
    -webkit-box-align: center;
    align-items: center;
    padding: 12px 10px;
    img {
      margin-top: 119px;
      width: 149px;
      height: 134px;
    }
    .tips {
      color: rgb(125, 134, 148);
      text-align: center;
      margin: 33px 25px;
    }
  }

  a {
    text-decoration: none;
    color: #7d8695;
    cursor: pointer;
  }

  .svg-icon {
    color: rgb(65, 80, 88);
  }
  .svg-icon {
    fill: currentColor;
    width: 1em;
  }
  .svg-icon:hover,
  .svg-icon:active {
    fill: #1740dc;
  }
  .side-nav-icon {
    width: 12px;
    height: 16px;
    line-height: 16px;
    color: #040c2c;
  }
}
</style>

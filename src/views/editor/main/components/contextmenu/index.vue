<template>
  <div class="contextmenu-con" :style="styleObj" v-if="showMenu">
    <ul v-click-out-side="hideMenu">
      <template v-for="item in list">
        <li
          :key="item.type"
          @click="dealClick(item.type, $event)"
          v-if="item.show"
          :class="{ disabled: item.disabled }"
        >
          <a>
            <span>{{ item.name }}</span>
            <div class="shortfont" v-if="item.kbd">
              <kbd v-for="d in item.kbd.split(',')" :key="d">
                {{ d }}
              </kbd>
            </div>
          </a>
        </li>
        <div
          class="divider"
          v-if="item.divide && item.show && showDivide"
          :key="item.name"
        />
      </template>
    </ul>
  </div>
</template>
<script>
import helpComputed from "@/mixins/help-computed"
import baseOperate from "@/mixins/base-operate"
import key from "keymaster"
import { cloneDeep } from "lodash"
export default {
  name: "Contextmenu",
  mixins: [helpComputed, baseOperate],
  computed: {
    selectWidgetsCount() {
      return this.selectWidgets.length
    }
  },
  data() {
    return {
      list: [
        { name: "复制", kbd: "Ctrl,+,C", type: "copy" },
        { name: "剪切", kbd: "Ctrl,+,X", type: "cut" },
        {
          name: "粘贴",
          kbd: "Ctrl,+,V",
          type: "paste",
          divide: "true"
        },
        { name: "置顶", kbd: "", type: "toTop" },
        { name: "置底", kbd: "", type: "toBottom", divide: "true" },
        { name: "组合", kbd: "", type: "group", disabled: true },
        {
          name: "解散",
          kbd: "",
          type: "ungroup",
          disabled: true,
          divide: "true"
        },
        { name: "删除", kbd: "delete", type: "del" }
      ],
      styleObj: {},
      showMenu: false,
      showDivide: true
    }
  },
  mounted() {
    this.ele = document.querySelector(".view-con")
    this.ele.addEventListener("contextmenu", this.onContextmenu)
    this.list.forEach(item => {
      if (item.kbd) {
        key(this.dealKbd(item.kbd), () => this.dealClick(item.type))
      }
    })
    const component = this.$mount()
    document.querySelector("body").appendChild(component.$el)
  },
  beforeDestroy() {
    this.ele.removeEventListener("contextmenu", this.onContextmenu)
    this.list.forEach(item => {
      if (item.kbd) {
        key.unbind(this.dealKbd(item.kbd))
      }
    })
  },
  methods: {
    onContextmenu(evt) {
      evt.preventDefault()
      const { clientX, clientY } = evt
      this.styleObj = {
        left: `${clientX}px`,
        top: `${clientY}px`
      }
      if (!this.selectWidgetsCount) {
        this.dealMenuInclude(["paste"])
      } else {
        this.dealMenuIncludeAll()
        if (this.selectWidgetsCount > 1) {
          this.enabledMenuItem(["group"], false)
        } else {
          const { cname } = this.currentWidget
          if (cname === "GtGroup") {
            this.enabledMenuItem(["ungroup"], false)
          }
        }
      }
      this.showMenu = true
    },
    enabledMenuItem(types, anabled) {
      types.forEach(type => {
        let item = this.list.find(d=>d.type == type)
        if (item) {
          this.$set(item, "disabled", anabled)
        }
      })
    },
    dealMenuInclude(types) {
      this.showDivide = types.length != 1
      this.list.forEach(item => {
        this.$set(item, "show", types.includes(item.type))
      })
    },
    dealMenuExclude(types) {
      this.list.forEach(item => {
        this.$set(item, "show", !types.includes(item.type))
      })
    },
    dealMenuIncludeAll() {
      this.list.forEach(item => {
        this.$set(item, "show", true)
      })
    },
    dealKbd(kbd) {
      const arr = kbd.split(",")
      let res = []
      arr.forEach(d => {
        if (d != "+") {
          d = d.charAt(0).toLowerCase() + d.slice(1)
        }
        res.push(d)
      })
      return res.join("")
    },
    hideMenu() {
      this.showMenu = false
    },
    dealClick(type) {
      switch (type) {
        case "copy":
          this.copy()
          break
        case "del":
          this.del()
          break
        case "cut":
          this.cut()
          break
        case "paste":
          this.paste()
          break
        case "toTop":
          this.toTop()
          break
        case "toBottom":
          this.toBottom()
          break
        case "group":
          this.group()
          break
        case "ungroup":
          this.ungroup()
          break
      }
      this.hideMenu()
    },
    del() {
      this.$store.commit("widgetDel")
    },
    paste() {
      if (this.copyData && this.copyData.length) {
        let len = 0
        this.copyData.forEach(item => {
          if(!this.isCut) {
            this.$store.commit("updateWidget", { cid: item.cid, active: false })
          }
          item.copyNum = item.copyNum + 1
          item = { ...item.attrs, ...item }
          len = item.copyNum === 1 ? "" : item.copyNum
          item.left = item.left + 20
          item.top = item.top + 20
          item.dname = `${this.copyData.cname} Copy${len}`
          this.$store.commit("widgetAdd", { ...item, cid: "", active: true })
        })
      }
    },
    copy() {
      this.dealCopyData(false)
    },
    cut() {
      this.dealCopyData(true)
      this.$store.commit("widgetDel")
    },
    dealCopyData(isCut) {
      if (this.selectWidgets.length) {
        this.isCut = isCut
        this.copyData = cloneDeep(this.selectWidgets)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.contextmenu-con {
  z-index: 2000;
  position: fixed;
  pointer-events: auto;
  font-size: 12px;
  color: #040c2c;
  ul {
    position: absolute;
    top: 0px;
    left: 0px;
    padding: 4px 0px;
    min-width: 240px;
    background: rgb(255, 255, 255);
    border-radius: 2px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 8px 0px;
    transition: opacity 0s ease 0s, transform 0.2s ease-in-out 0s;
    transform-origin: 0px 0px;
    animation: 0.2s ease 0s 1 normal forwards running fcEaNs;
    color: rgb(65, 80, 88);
    list-style: none;
  }
  li {
    &.disabled {
      pointer-events: none;
      a {
        color: rgb(200, 205, 208);
      }
    }
    a {
      height: 28px;
      padding-left: 16px;
      padding-right: 14px;
      display: flex;
      align-items: center;
      color: rgb(65, 80, 88);
      .shortfont {
        margin-left: auto;
      }
      kbd {
        display: inline-block;
        text-align: center;
        min-width: 12px;
        color: rgb(141, 158, 167);
      }
      &:hover {
        color: rgb(41, 141, 248);
      }
    }
    &:hover {
      background: rgba(0, 0, 0, 0.04);
    }
  }
  .divider {
    margin: 4px 0px;
    border-top: 1px solid rgb(237, 237, 237);
  }
}
</style>

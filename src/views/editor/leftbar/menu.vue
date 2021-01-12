<template>
  <div>
    <div style="">
      <div class="ge-menu ge-fx">
        <span class="left">页面</span>
        <a class="pa10" @click="add"> + </a>
      </div>
      <div class="ge-menu pa10" v-for="item in menuList" :key="item.name">
        <div class="ge-re">
          <div>{{ item.name }}</div>
          <div v-if="item.children">
            <div
              v-for="child in item.children"
              class="ge-menu"
              :key="child.name"
            >
              <div class="ge-re">
                <span>{{ child.name }}</span>
                <div class="ge-ab">
                  <a-tooltip placement="right">
                    <template slot="title">
                      <div slot="extra">复制页面</div>
                      <div slot="extra">复制页面</div>
                      <div slot="extra">复制页面</div>
                      <div slot="extra">复制页面</div>
                    </template>
                    <a> ...</a>
                  </a-tooltip>
                </div>
              </div>
            </div>
          </div>
          <div class="ge-ab">
            <a-tooltip placement="right">
              <template slot="title">
                <div slot="extra">复制页面</div>
                <div slot="extra">复制页面</div>
                <div slot="extra">复制页面</div>
                <div slot="extra">复制页面</div>
              </template>
              <a> ...</a>
            </a-tooltip>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      menuList: [
        {
          name: "监控系统",
          url: "http://192.168.1.100:9999",
          iconType: "laptop"
        },
        {
          name: "模块接口",
          url: null,
          iconType: "bars",
          children: [
            {
              name: "订单模块",
              url: "http://192.168.1.100:8890//swagger-ui.html",
              iconType: "italic"
            }
          ]
        }
      ]
    }
  },
  methods: {
    open(item) {
      console.log(item)
    },
    add() {
      let obj = {
        name: "关于",
        url: "http://192.168.1.100:9999",
        iconType: "laptop"
      }
      this.menuList.push(obj)
    }
  }
}
</script>
<style lang="less" scoped>
.ge-width {
  width: 160px;
}
.ge-fx {
  display: flex;
  justify-content: space-between;
}
.ge-menu {
  font-size: 16px;
  padding: 6px;
  background: rgb(232, 236, 236);
  vertical-align: middle;
}
li {
  list-style-type: none;
}
.ge-re {
  position: relative;
  background: #f2f2f2;
  padding: 4px;
  cursor: pointer;
}
.ge-re:active,
.ge-re:hover,
.ge-re:focus {
  color: #1890ff;
}
.ge-ab {
  position: absolute;
  right: 10px;
  top: -4px;
  cursor: pointer;
}
.pa10 {
  padding: 0 10px;
}
.active {
  color: #1890ff;
}
</style>

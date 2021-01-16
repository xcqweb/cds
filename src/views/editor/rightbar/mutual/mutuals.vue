<template>
  <div class="mutuals">
    <div class="m-content">
      <a class="jZTldN" @click="add">
        <span>添加事件</span>
      </a>
      <ol v-if="data.length" class="link-list">
        <div class="link-content">
          <div class="link-header fs">
            <span class="link-title">交互</span>
            <a class="action">
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
          <div class="link-header fs">
            <span class="link-title">事件</span>
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
const no_links_light = require("@/assets/images/no_links_light.png")
export default {
  name: "mutuals",
  components: {},
  data() {
    return {
      imgUrl: no_links_light,
      data: [
        {
          title: "Ant Design Title 1",
          key: "2"
        },
        {
          title: "Ant Design Title 2",
          key: "3"
        },
        {
          title: "Ant Design Title 3",
          key: "1"
        },
        {
          title: "Ant Design Title 4",
          key: "4"
        }
      ],
      activeKey: [],
      text: `A dog is a type of domesticated animal.Known for its loyalty and faithfulness,it can be found as a welcome guest in many households across the world.`,
      customStyle:
        "background: #fff;border-radius: 4px;margin-bottom: 14px;border: 0;overflow: hidden;position:relative"
    }
  },
  watch: {},
  methods: {
    add() {
      let len = this.data.length + 1
      let obj = {
        title: "Ant Design Title 1",
        key: len.toString()
      }
      this.data.push(obj)
    },
    change(key) {
      console.log(key)
    },
    del(item) {
      if (this.data.indexOf(item) > -1) {
        this.data.splice(this.data.indexOf(item), 1)
      }
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
  .m-content {
    height: calc(100% - 36px);
    padding: 0px 9px;
  }
  .jZTldN {
    height: 22px;
    width: 212px;
    display: flex;
    color: rgb(255, 255, 255);
    margin: 12px 0px;
    border-radius: 2px;
    background: rgb(41, 141, 248);
    span {
      text-align: center;
      line-height: 22px;
      flex: 1 1 0%;
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
}
.link-list {
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  width: 212px;
  background-color: rgb(245, 245, 245);
  margin-bottom: 13px;
  border-radius: 2px;
  transition: all 0.2s ease-in-out 0s;
  .link-content {
    padding: 15px 5px 10px;
    .link-header {
      height: 31px;
      padding: 0px 7px 13px 10px;
    }
    .link-title {
      color: rgb(91, 107, 115);
    }
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
</style>

<template>
  <div class="mutuals">
    <div class="m-content">
      <a class="jZTldN" @click="add('add')">
        <span>添加事件</span>
      </a>
      <ol v-if="data.length" class="link-list" >
        <div class="link-content" v-for="(obj,index) in data" :key="index">
          <div class="link-header fs">
            <span class="link-title">交互{{index}}</span>
            <a class="action">
              <svg xmlns="http://www.w3.org/2000/svg" class="svg-icon design/trash" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 3.5h8v7a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-7zm2.5 2A.5.5 0 0 0 4 6v3a.5.5 0 0 0 1 0V6a.5.5 0 0 0-.5-.5zm3 0A.5.5 0 0 0 7 6v3a.5.5 0 0 0 1 0V6a.5.5 0 0 0-.5-.5zM5 1a.5.5 0 0 1 .5-.5h1A.5.5 0 0 1 7 1a.5.5 0 0 0 .5.5h3a.5.5 0 1 1 0 1h-9a.5.5 0 0 1 0-1h3A.5.5 0 0 0 5 1z"></path></svg></a>
          </div>
          <div class="link-header mgb10 fs">
            <span class="link-title">事件</span>
            <a-select
              mode="default"
              v-model="obj.eventValue"
              placeholder="Please select"
              @change="(e) => setMutuals(e,'event')"
            >
              <a-select-option
                v-for="item in eventPC"
                :key="item.value"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
          </div>

          <div class="link-header mgb10 fs">
            <span class="link-title">动作</span>
            <a-select
              mode="default"
              v-model="obj.actionValue"
              placeholder="Please select"
              @change="(e) => setMutuals(e,'action')"
            >
              <a-select-option
                v-for="item in actions"
                :key="item.value"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
          </div>

          <div class="link-header mgb10 fs">
            <span class="link-title">方式</span>
            <a-select
              mode="default"
              v-model="obj.wayValue"
              placeholder="Please select"
              @change="(e) => setMutuals(e,'way')"
            >
              <a-select-option
                v-for="item in ways"
                :key="item.value"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
          </div>
          <div v-if="actionValue == 3">
            <div class="link-header">
              <span class="link-title">方式</span>
            </div>
            <div class="way-texta">
              <a-textarea
                class="link"
                @blur="(e) => setMutuals(e,'input')"
                v-model="obj.hrefValue"
                placeholder="Controlled autosize"
                :auto-size="{ minRows: 3, maxRows: 5 }"
              />
            </div>
          </div>
        </div>

      </ol>
      <div v-else class="bHaNhk">
        <img :src="imgUrl">
        <p class="tips">快去创建链接，让您的原型动起来吧！</p>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api/mutuals"
const no_links_light = require('@/assets/images/no_links_light.png')
export default {
  name: "mutuals",
  components: {},
  data() {
    return {
      imgUrl:no_links_light,
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
      form:{
        hrefValue:'',
        eventValue:'1',
        actionValue:'1',
        wayValue:'1',
      },
      eventPC:[
        {
          value: "1",
          label: "点击"
        },
        {
          value: "2",
          label: "双击"
        }],
      eventPh:[
        {
          value: "1",
          label: "点击"
        },
        {
          value: "2",
          label: "双击"
        },
        {
          value: "3",
          label: "左滑"
        },
        {
          value: "4",
          label: "右滑"
        },
        {
          value: "5",
          label: "上滑"
        },
        {
          value: "6",
          label: "下滑"
        }],
      actions:[
        {
          value: "1",
          label: "跳转页面"
        },
        {
          value: "2",
          label: "显隐组件"
        },
        {
          value: "3",
          label: "打开链接"
        }],
      ways:[
        {
          value: "1",
          label: "跳转页面"
        },
        {
          value: "2",
          label: "显隐组件"
        },
        {
          value: "3",
          label: "打开链接"
        }],
      activeKey: [],
      text: `A dog is a type of domesticated animal.Known for its loyalty and faithfulness,it can be found as a welcome guest in many households across the world.`,
      customStyle:
        "background: #fff;border-radius: 4px;margin-bottom: 14px;border: 0;overflow: hidden;position:relative"
    }
  },
  computed:{
    currentWidget() {
      return this.$store.getters["currentWidget"]
    },
  },
  watch: {},
  methods: {
    handleOk() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const params = {
            appType: 0,
            classifyId: "",
            descript: "test",
            height: "768",
            picUrl: "",
            scale: "1",
            studioName: this.form.studioName,
            id: this.form.id,
            tenantId: "",
            theme: "",
            width: "1024"
          }
          if (this.form.id) {
            api.edit(params).then(res => {
              if (res.code === 0) {
                this.$message.success("修改应用成功")
                this.resetForm()
                this.visible = false
                this.queryApply()
              }
            })
          } else {
            api.add(params).then(res => {
              if (res.code === 0) {
                this.$message.success("新建应用成功")
                this.resetForm()
                this.visible = false
                this.queryApply()
              }
            })
          }
        } else {
          console.log("error submit!!")
          return false
        }
      })
    },
    getList() {
      let params ={
        widgetId:this.currentWidget.cid
      }
      api.list(params).then(res => {
        if (res.code === 0) {
          this.data = res.data
        }
      })
    },
    del() {
      let params ={
        actionIds:this.currentWidget.cid
      }
      api.del(params).then(res => {
        if (res.code === 0) {
          this.data = res.data
        }
      })
    },
    add(type) {
      let params = {}
      if(type == 'add') {
        let params = {
          "actionId": "",
          "actionType": "",
          "content": {
            "wayValue": "",
            "actionValue": "",
            "hrefValue": "",
            "eventValue": ""
          },
          "widgetId": this.currentWidget.cid
        }
      }
      api.add(params).then(res => {
        if (res.code === 0) {
          this.$message.success("新增成功")
        }
      })
    },
    change(key) {
      console.log(key)
    },
    setMutuals(type){
      console.log(type)

    },
    del(item) {
      if (this.data.indexOf(item) > -1) {
        this.data.splice(this.data.indexOf(item), 1)
      }
    }
  }
}
</script>
<style>
@import '../index.less'
</style>
<style lang="less">
 .mutuals {
   width: 230px;
   display: flex;
   flex-direction: column;
   flex: 1 1 0%;
   overflow: hidden;
   font-size: 12px;
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
  img{
    margin-top: 119px;
    width: 149px;
    height: 134px;
  }
  .tips{
    color: rgb(125, 134, 148);
    text-align: center;
    margin: 33px 25px;
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
     padding: 10px 5px 10px;
     .link-header{
       height: 31px;
       padding: 0px 7px 10px 10px;
     }
     .link-title{
       height: 18px;
       line-height: 18px;
       color: rgb(91, 107, 115);
     }
   }
   .ant-select-selection{
     width: 142px;
     height: 30px;
     background: #FFFFFF;
     border-radius: 2px;
     border: 1px solid #F0F1F3;
   }
   .link{
     width: 190px;
     height: 69px;
     background: #FFFFFF;
     border-radius: 2px;
     border: 1px solid #F0F1F3;
   }
   .way-texta{
     padding: 0px 7px 0px 10px;
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
 }
</style>

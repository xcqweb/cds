<template>
  <div
    v-if="visible"
    :style="objStyle"
    class="ds-panel-con"
    v-click-out-side="hide"
  >
    <a-tabs size="small" :animated="false" class="content-con">
      <a-tab-pane key="all" :tab="allText">
        <div class="panel-header fs">
          <a-input v-model="keyword" placeholder="请输入关键字" size="small">
            <a-tooltip slot="suffix" title="搜索">
              <a-icon type="search" style="cursor:pointer;" @click="search"/>
            </a-tooltip>
          </a-input>
          <svg-icon icon-class="reset" class="reset-icon" @click.native="reset"/>
        </div>
        <ul>
          <li
            v-for="item in list"
            :key="item[valueKey]"
            :value="item[valueKey]"
            @click="itemClick(item)"
            :class="{'select':selectId==item[valueKey]}"
          >
            {{ item[labelKey] }}
          </li>
        </ul>
      </a-tab-pane>
      <a-tab-pane key="recent" :tab="recentText" @tabClick="initRecent">
        <ul>
          <li v-for="item in recentList" :key="item[valueKey]" :value="item[valueKey]">
            {{ item[labelKey] }}
          </li>
        </ul>
      </a-tab-pane>
    </a-tabs>
    <div class="footer">
      <a-button size="small" @click="hide">取消</a-button>
      <a-button size="small" type="primary" style="margin-left:10px;" @click="confirm">
        确定
      </a-button>
    </div>
  </div>
</template>
<script>
import instance from "@/api/index"
export default {
  name: "DatasourcePanel",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    objStyle: Object,
    allText: String,
    recentText: {
      type: String,
      default: "最近使用"
    },
    recentLocalKey: String,
    url:String,
    code:String,
    dimCode:String,
    labelKey:String,
    valueKey:{
      type:String,
      default:'mark'
    },
    keywordKey:String,
    choosedData:Object,
  },
  watch:{
    visible() {
      this.initList()
    },
  },
  components: {},
  data() {
    return {
      recentList: [],
      keyword:'',
      list:[],
      selectId:'',
      currentItem:'',
    }
  },
  mounted() {
  },
  methods: {
    initRecent() {
      let arr = localStorage.getItem([this.recentLocalKey])
      if(arr) {
        this.recentList = JSON.parse(arr)
      } else {
        this.recentList = []
      }
    },
    hide() {
      this.$emit("update:visible", false)
    },
    initList() {
      if(!this.url) {
        return
      }
      let params = {functionCode:this.code}
      if(this.keywordKey == 'deviceName') {
        params.deviceModelMark = this.choosedData.deviceModelMark
      }
      instance.post(this.url,params).then(res=>{
        if(res.code == 0) {
          this.list = res.data
        }
      })
    },
    itemClick(item) {
      this.currentItem = item
      this.selectId = item[this.valueKey]
    },
    search() {
      let params = {functionCode:this.dimCode}
      params[this.keywordKey] = this.keyword
      if(this.keywordKey == 'deviceName') {
        params.deviceModelMark = this.choosedData.deviceModelMark
      }
      instance.post(this.url,params).then(res=>{
        if(res.code == 0) {
          this.list = res.data
        }
      })
    },
    confirm() {
      let arr = localStorage.getItem([this.recentLocalKey])
      if(arr) {
        arr = JSON.parse(arr)
      } else {
        arr = []
      }
      arr.push(this.currentItem)
      localStorage.setItem(this.recentLocalKey, JSON.stringify(arr))
      this.$emit("itemClick", this.currentItem)
      this.hide()
    },
    reset() {
      this.initList()
    },
  }
}
</script>
<style lang="less" scoped>
.ds-panel-con {
  position: absolute;
  background-color: #fff;
  left: calc(-100% + 19px);
  top: 120px;
  box-shadow: 0px 2px 6px 0px rgba(4, 12, 44, 0.25);
  border-radius: 2px;
  border: 1px solid #e6e7ea;
  .content-con {
    max-height: 40vh;
    overflow: auto;
    border-bottom: solid 1px #e5e6e9;
  }
  .footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 10px;
  }
  .ant-btn-sm {
    font-size: 12px;
  }
  .panel-header{
    padding:10px;
    .reset-icon{
      font-size:16px;
      margin-left:10px;
      cursor:pointer;
    }
  }
  li{
    padding:5px 12px;
    cursor:pointer;
    &:hover,&.select{
      color: #298df8;
      background: #f2f8ff;
    }
  }
}
</style>

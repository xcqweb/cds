<template>
  <div class="left-con">
    <a-tabs v-model="tabKey" tabPosition="left" size="small">
      <a-tab-pane :key="item.key" v-for="item in tabs">
        <div slot="tab" class="slot-tab-con">
          <svg-icon :icon-class="item.iconCls" slot="tab" class-name="side-nav-icon"/>
        </div>
        <component
          :is="item.cname"
        />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import ApplyPage from "./apply-page"
import ApplyWidget from './apply-widget'
export default {
  components:{
    ApplyPage,
    ApplyWidget,
  },
  data() {
    return {
      tabs:[
        {key:'page',iconCls:'side-page',cname:'ApplyPage'},
        {key:'widget',iconCls:'side-page',cname:'ApplyWidget'},
      ],
      tabKey:'page',
    }
  },
  created() {},
  methods: {}
}
</script>

<style lang="less">
.left-con {
  width: 249px;
  box-sizing: content-box;
  position: relative;
  display: flex;
  background: #fff;
  border-right: 1px solid#E5E6E9;
  z-index: 4;
  .ant-tabs{
    width:100%;
    .ant-tabs-tab {
      padding: 8px 6px;
    }
    .ant-tabs .ant-tabs-left-bar {
      border-right: 1px solid#E5E6E9;
    }
    .ant-tabs-left-content{
      padding-left:0;
      height:100%;
      display: flex;
      flex-direction: column;
    }
  }
  .slot-tab-con{
    width:38px;
    height:38px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .side-nav-icon{
    width:1.6em;
    height:1.6em;
  }
}
</style>

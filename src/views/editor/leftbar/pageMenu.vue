<template>
  <div>
  <a-menu
    style="width: 256px"
    :default-selected-keys="['1']"
    :open-keys.sync="openKeys"
    mode="inline"
    @click="handleClick"
  >
    <template v-for="item in menuList">
      <a-menu-item v-if="!item.children" :key="item.name">
        <div style="display: flex;justify-content: space-between">
          <div>
            <a-icon :type="item.iconType" />
            <span>{{item.name}}</span>
          </div>
          <div>
            <a-button type="link"  @click.prevent="(e) => addMenu(e,true)">
              +
            </a-button>
          </div>
        </div>
      </a-menu-item>
      <sub-menu v-else :menu-info="item" :key="item.name" @addMenu="addMenu" >
        <a-button type="link"  @click.prevent="(e) => addMenu(e,true)">
          +
        </a-button>
      </sub-menu>
    </template>
  </a-menu>
    <modalDialog :visible="visible" @hideDialog="hideDialog"></modalDialog>
  </div>
</template>

<script>
import subMenu from './sub-menu'
import modalDialog from '@/components/modal/modal'
export default {
  name: "pageMenu",
  components:{
    subMenu,
    modalDialog
  },
  data() {
    return {
      visible:false,
      current: ['mail'],
      openKeys: ['sub1'],
      "menuList": [
        {
          "name": "监控系统",
          "url": "http://192.168.1.100:9999",
          "iconType": "laptop",
        },
        {
          "name": "模块接口",
          "url": null,
          "iconType": "bars",
          "children": [
            {
              "name": "订单模块",
              "url": "http://192.168.1.100:8890//swagger-ui.html",
              "iconType": "italic",
              "children": [
                {
                  "name": "模块接口",
                  "url": null,
                  "iconType": "bars",
                  "children": [
                    {
                      "name": "订单模块",
                      "url": "http://192.168.1.100:8890//swagger-ui.html",
                      "iconType": "italic",
                    }
                  ]
                },
              ]
            }
          ]
        },
        {
          "name": "关于",
          "url": "http://192.168.1.100:9999/about",
          "iconType": "info",
        }
      ]
    };
  },
  watch: {
    openKeys(val) {
      console.log('openKeys', val);
    },
  },
  methods: {
    handleClick(e) {
      console.log('click', e);
      this.openKeys = ["sub1", "订单模块", "模块接口"]
      // this.menuList
    },
    hideDialog(val){
      this.visible = val
    },
    addMenu(e){
      console.log('click', e);
      this.visible = true
    },
    titleClick(e) {
      console.log('titleClick', e);
    },
  },
}
</script>

<style scoped>

</style>

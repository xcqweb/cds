<template>
  <div
    class="preview-menu-con"
    :class="{
      'menu-collapse': isCollapsed,
      'menu-horizontal': mode === 'horizontal',
      'menu-vertical': mode === 'vertical',
    }"
  >
    <a-menu v-if="pages.length > 0"
      :open-keys.sync="openKeys"
      :mode="mode === 'horizontal'?'horizontal':'inline'"
      :theme="theme"
      v-model="selectedKeys"
      @click="handleClick"
    >
      <template v-for="item in pages">
        <a-menu-item 
          :key="item.pageId"
          v-if="!item.children"
        >
          {{ item.pageName }}
        </a-menu-item >
        <a-sub-menu
          v-else 
          @titleClick="titleClick" 
          :key="item.pageId">
          <span slot="title">{{ item.pageName }}</span>
          <a-menu-item :key="c.pageId" c in item.children>
            {{ c.pageName }}
          </a-menu-item>
        </a-sub-menu> 
      </template>
    <!-- 测试数据 -->
    <!--   <a-menu-item key="1">
        Navigation One
      </a-menu-item> 
      <a-menu-item key="2">
        Navigation Two
      </a-menu-item>
      <a-sub-menu @titleClick="titleClick" key="sub1">
        <span slot="title">Navigation Three</span>
        <a-menu-item key="3">
          Option 3
        </a-menu-item>
        <a-menu-item key="4">
          Option 4
        </a-menu-item>
      </a-sub-menu>
      <a-sub-menu @titleClick="titleClick" key="sub2">
        <span slot="title">Navigation four</span>
        <a-menu-item key="5">
          Option 3
        </a-menu-item>
        <a-menu-item key="6">
          Option 4
        </a-menu-item>
      </a-sub-menu> -->
    </a-menu>
  </div>
</template>

<script>
import Menu from "@c/preview-menu/menu"
import Submenu from "@c/preview-menu/submenu"
import MenuItem from "@c/preview-menu/menu-item"
import {addClass,removeClass} from "@/utils/handle-class"
const modes = ["vertical", "horizontal"]
export default {
  name: "PreviewMenu",
  props: {
    pages: Array,
    apply: Object
  },
  computed: {
    mode() {
      return modes[this.apply.navPosition - 1]
    },
    navStyle() {
      return JSON.parse(this.apply.navStyle)
    },
    theme() {
      return this.navStyle.theme
    }
  },
  components: {
    Menu,
    Submenu,
    MenuItem
  },
  data() {
    return {
      openKeys: [],
      selectedKeys: [],
      isCollapsed: false
    }
  },
  watch: {
    mode(val) {},
    pages(val){
      if (val.length > 0){
        this.selectedKeys = [val[0].pageId];
      }
    },
  },
  created() {
  },
  mounted() {
    // 如果pages有数据直接赋值，没数据在watch里赋值
    if(this.pages.length > 0){
      this.selectedKeys = [this.pages[0].pageId];
    }
  },
  methods: {
    initMenus() {},
    itemSelect(pageId) {
      console.log(`当前页面id:${pageId}`);
    },
    handleClick(e) {
      // console.log('click ', e);
      this.current = e.key;
      this.removeSelectClass();
      this.itemSelect(e.key);
    },
    removeSelectClass(){
      document.querySelectorAll('.preview-menu-con .ant-menu-submenu').forEach(el => {
        removeClass(el.querySelector('.ant-menu-submenu-title'),'ant-menu-item-selected');
        el.setAttribute('data-selected','');
      })
    },
    titleClick(val) {
      let key = val.key;
      let domEvent = val.domEvent;
      let openKeysCopy = this.openKeys.slice();
      /* console.log('click',domEvent.target.className,domEvent);
      console.log('click',key,this.openKeys); */
      this.selectedKeys = [key];
      
      if (domEvent.target.className.includes('ant-menu-submenu-title')){
        this.removeSelectClass();
        // 水平时选中其父元素，纵向时选中其本身
        if (this.mode === 'horizontal'){
          domEvent.target.parentNode.setAttribute('data-selected','selected');
        }else {
          addClass(domEvent.target,'ant-menu-item-selected');
        }
        // 本来收起时父元素 none 避免展开动画效果，本来展开时设置高度避免再次展开动画
        if (!this.openKeys.includes(key)){
          domEvent.target.parentNode.setAttribute('data-display','none');
        }else {
          domEvent.target.parentNode.setAttribute('data-height','auto');
        }
        this.$nextTick(() => this.openKeys = openKeysCopy.slice());
      }else if (domEvent.target.className === '' && domEvent.target.localName === 'span'){
        this.removeSelectClass();
        if (this.mode === 'horizontal'){
          domEvent.target.parentNode.parentNode.setAttribute('data-selected','selected');
        }else {
          addClass(domEvent.target.parentNode,'ant-menu-item-selected');
        }
        if (!this.openKeys.includes(key)){
          domEvent.target.parentNode.parentNode.setAttribute('data-display','none');
        }else {
          domEvent.target.parentNode.parentNode.setAttribute('data-height','auto');
        }
         this.$nextTick(() => this.openKeys = openKeysCopy.slice());
      }else if(domEvent.target.className === 'ant-menu-submenu-arrow') {
        domEvent.target.parentNode.parentNode.setAttribute('data-display','');
        domEvent.target.parentNode.parentNode.setAttribute('data-height','');
      }
      this.itemSelect(key);
    },
  }
}
</script>
<style lang="less">
.preview-menu-con {
  position: absolute;
  top: 0;
  width: 200px;
  height: 100%;
  opacity: 0.98;
  &.menu-horizontal {
    height: 60px;
    width: 100%;
  }
  .ant-menu-submenu-arrow{
    height: 10px;
  }
  .ant-menu-inline{
    height: 100%;
  }
  .ant-menu-submenu-inline{
    .ant-menu-submenu-title{
      position: relative;
      &::after{
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        border-right: 3px solid #1890ff;
        transform: scaleY(0.0001);
        opacity: 0;
        transition: transform 0.15s cubic-bezier(0.215, 0.61, 0.355, 1), opacity 0.15s cubic-bezier(0.215, 0.61, 0.355, 1);
        content: '';
      }
      &.ant-menu-item-selected{
        &::after{
          transform: scaleY(1);
          opacity: 1;
          transition: transform 0.15s cubic-bezier(0.645, 0.045, 0.355, 1), opacity 0.15s cubic-bezier(0.645, 0.045, 0.355, 1);
        }
      }
    }
  }
  .ant-menu-submenu-horizontal{
    
  } 
  // 使用js 添加 class 会被清掉，所以使用属性选择器
  li[data-display="none"]{
    .ant-menu{
      display: none;
    }
  }
  li[data-height="auto"]{
    .ant-menu{
      height: auto !important;
      opacity: 1 !important;
    }
  }
  li[data-selected="selected"]{
    border-bottom: 2px solid #1890ff;
    color: #1890ff;
  }
}
</style>

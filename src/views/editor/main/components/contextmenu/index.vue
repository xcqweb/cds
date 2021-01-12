<template>
  <div class="contextmenu-con" :style="styleObj" v-if="showMenu">
    <ul v-click-out-side="hideMenu">
      <template v-for="item in list"> 
        <li :key="item.name" @click="dealClick(item.type)" v-if="item.show">
          <a>
            <span>{{item.name}}</span>
            <div class="shortfont" v-if="item.kbd">
              <kbd v-for="d in item.kbd.split(',')">
                {{d}}
              </kbd>
            </div>
          </a>
        </li>
        <div class="divider" v-if="item.divide&&item.show"></div>
      </template>
    </ul>
  </div>
</template>
<script>
import helpComputed from "@/mixins/help-computed"
import key from 'keymaster'
export default {
  name:'Contextmenu',
  mixins: [helpComputed],
  computed:{
    selectWidgetsCount() {
      return this.selectWidgets.length
    }
  },
  data() {
    return {
      list:[
        {name:'复制',kbd:'Ctrl,+,C',type:'copy',show:false},
        {name:'剪切',kbd:'Ctrl,+,X',type:'cut',show:false},
        {name:'粘贴',kbd:'Ctrl,+,V',type:'paste',show:false,divide:'true'},
        {name:'置顶',kbd:'',type:'top',show:false},
        {name:'置底',kbd:'',type:'bottom',show:false,divide:'true'},
        {name:'组合',kbd:'',type:'group',show:false},
        {name:'打散',kbd:'',type:'ungroup',show:false,divide:'true'},
        {name:'删除',kbd:'',type:'ungroup',show:false},
      ],
      styleObj:{},
      showMenu:false,
    }
  },
  mounted() {
    this.ele = document.querySelector('.view-con')
    this.ele.addEventListener('contextmenu',this.onContextmenu)
    this.list.forEach(item=>{
      if(item.kbd) {
        key(this.dealKbd(item.kbd),this.copy)
      }
    })
  },
   beforeDestroy() {
    this.ele.removeEventListener("contextmenu", this.onContextmenu)
    this.list.forEach(item=>{
      if(item.kbd) {
        key.unbind(this.dealKbd(item.kbd))
      }
    })
  },
  methods: {
    onContextmenu(evt) {
      evt.preventDefault()
      const {clientX,clientY} = evt
      this.styleObj = {
        left: `${clientX}px`,
        top: `${clientY}px`,
      }
      if(!this.selectWidgetsCount) {
        this.dealMenuInclude(['paste'])
      }else {
        this.dealMenuIncludeAll()
      }
      this.showMenu = true
    },
    dealMenuInclude(types) {
      this.list.forEach(item=>{
        this.$set(item,'show',types.includes(item.type))
      })
    },
    dealMenuExclude(types) {
      this.list.forEach(item=>{
        this.$set(item,'show',!types.includes(item.type))
      })
    },
    dealMenuIncludeAll() {
       this.list.forEach(item=>{
        this.$set(item,'show',true)
      })
    },
    dealKbd(kbd) {
      const arr = kbd.split(',')
      let res = []
      arr.forEach(d=>{
        if(d != "+") {
          d = d.charAt(0).toLowerCase() + d.slice(1)
        }
        res.push(d)
      })
      return res.join('')
    },
    hideMenu() {
      this.showMenu = false
    },
    dealClick(type) {
      switch(type) {
        case 'copy':
          this.copy()
        break
      }
      this.hideMenu()
    },
    copy() {
      console.log('--copy--')
    },
  },
}
</script>
<style lang="less" scoped>
.contextmenu-con{
  z-index:2000;
  position:fixed;
  pointer-events: auto;
  ul{
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
    a{
      height: 28px;
      padding-left: 16px;
      padding-right: 14px;
      display: flex;
      align-items: center;
      color: rgb(65, 80, 88);
      .shortfont{
        margin-left: auto;
      }
      kbd{
        display: inline-block;
        text-align: center;
        min-width: 12px;
        color: rgb(141, 158, 167);
      }
      &:hover{
        color: rgb(41, 141, 248);
      }
    }
    &:hover{
      background: rgba(0, 0, 0, 0.04);
    }
  }
  .divider{
    margin: 4px 0px;
    border-top: 1px solid rgb(237, 237, 237);
  }
}
</style>

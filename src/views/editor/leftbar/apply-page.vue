<template>
  <div class="page-con"> 
    <div class="header">
      <span>页面</span>
      <a-icon type="plus" class="icon" @click="addPage"/>
    </div>
    <div class="scroll-con">
      <ul>
        <li v-for="page in pages" :key="page.pageId" @dblclick="dblclick(page)" @click="changePage(page)"> 
          <div class="item" :class="{'active':isCurrentPage(page)}">
            <a class="expander" :class="{'is-expand':page.expand}" v-if="page.children">
              <svg-icon icon-class="arrow-left" />
            </a>
            <div class="name-con">
              <div class="name-icon">
                <svg-icon icon-class="page-icon" class-name="icon" />
              </div>
              <div class="name" :class="{'is-eidt':page.isEdit}">
                <input v-if="page.isEdit" v-model="page.pageName" v-focus @blur="hideEdit(page)"/>
                <template v-else>{{page.pageName}}</template>
              </div>
              <div class="actions" v-if="!page.isEdit">
                <svg-icon icon-class="page-action" class-name="icon" />
              </div>
              <svg-icon icon-class="page-dot" class-name="active-circle" v-if="isCurrentPage(page)"/>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import pageApi from "@a/page"
import arrayToTree from "array-to-tree"
export default {
  name:'ApplyPage',
  computed:{
    pages() {
      let pages = this.$store.state.apply.pages
      pages = arrayToTree(pages, { parentProperty: "pid", customID: "pageId" })
      return pages
    },
    currentPage() {
      return this.$store.getters.currentPage
    },
  },
  
  data() {
    return {

    }
  },
  created() {
    this.applyId = sessionStorage.getItem('applyId')
  },
  methods: {
    isCurrentPage(page){
      if(this.currentPage && this.currentPage.pageId == page.pageId) {
        return true
      }
      return false
    },
    dblclick({pageId}) {
      this.$store.commit('setPageInfo',{pageId,isEdit:true})
      this.isAdd = false
    },
    nameChange(a,b,c) {
      console.lgo(a,b,c,)
    },
    changePage({pageId}) {
      this.$store.commit('setCurrentPageId',pageId)
    },
    hideEdit({pageName,pageId}) {
      console.log('click--out')
      this.$store.commit('setPageInfo',{pageName})
      this.savePage(pageId)
    },
    blur() {
      console.log('wey-----')
    },
    savePage(pageId) {
      let method
      let params
      let msg = ''
      if(this.isAdd) {
        method = 'add'
        msg = `新建页面成功`
        params = {...this.currentPage,appId:this.applyId,pageId:''}
      } else {
        method = 'modify'
        msg = `页面名称修改成功`
        params = {...this.currentPage,appId:this.applyId}
      }
      pageApi[method](params).then(res=>{
        if(res.code === 0) {
          let resObj = {pageId,isEdit:false}
          if(this.isAdd) {
            resObj = {...resObj,newPageId:res.data.pageId}
          }
          this.$store.commit('setPageInfo',resObj)
          this.$message.success(msg)
        }
      })
    },
    addPage() {
      const {width,height} = this.$store.state.apply
      const len = this.pages.length + 1
      this.$store.commit('setCurrentPageId','')
      this.$store.commit('addPage',{
        pageId:`page-${len}`,
        width,
        height,
        sort:len,
        pid:'',
        pageName:`页面 ${len}`,
        isEdit:true,
      })
      this.isAdd = true
    },
  },
}
</script>
<style lang="less">
.page-con{
  height: calc(100vh - 50px);
  .header {
    display: flex;
    justify-content: space-between;
    font-weight: 500;
    color: #040C2C;
    align-items: center;
    padding:9px 10px;
    border-bottom: solid 1px#E5E6E9;
    .icon{
      font-size:12px;
      cursor: pointer;
    }
  }
  .scroll-con{
    height:100%;
    overflow: hidden auto;
    .item{
      position: relative;
      height: 32px;
      padding-left: 14px;
      display: flex;
      align-items: center;
      border: 1px solid transparent;
      color: #040C2C;
      font-size: 12px;
      cursor: pointer;
      .expander{
        display: flex;
        width: 12px;
        margin-left: -12px;
        color: rgb(200, 205, 208);
        &.is-expand{
          transform: rotate(90deg);
        }
      }
      .name-con{
        display: flex;
        align-items: center;
        width: 100%;
        padding-right: 5px;
        .name-icon{
          display: flex;
          flex-shrink: 0;
          justify-content: center;
          align-items: center;
          width: 14px;
          height: 14px;
          margin-right: 8px;
          .icon{
            width: 9px;
            height: 12px;
            color: rgb(141, 158, 167);
          }
        }
        .name{
          width: 100%;
          height: 24px;
          line-height: 22px;
          border-top: 1px solid transparent;
          border-bottom: 1px solid transparent;
          margin-right:14px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          &.is-eidt{
            border-bottom: 1px solid rgb(245, 93, 84);
          }
          input {
            border: none;
            outline: none;
            width: 100%;
            height: 100%;
            background: transparent;
            color: rgb(82, 94, 113);
            white-space: nowrap;
            overflow: hidden;
          }
        }
      }
      .actions{
        display: none;
        .icon{
          font-size:14px;
        }
      }
      .active-circle{
        position: absolute;
        right: 10px;
        width: 6px;
        height: 6px;
        color:rgb(41, 141, 248);
      }
      &:hover{
        background: rgb(247, 247, 247);
        color: unset;
        .actions{
          display: block;
        }
        .active-circle {
          display:none;
        }
      }
      &.active{
        color: rgb(41, 141, 248);
        background: rgb(242, 248, 255);
        .expander{
          color: rgb(41, 141, 248);
        }
        .name-icon{
          .icon{
            color: rgb(41, 141, 248);
          }
        }
      }
    }
  }
  ul,li{
    list-style: none;
    position: relative;
  }
}
</style>
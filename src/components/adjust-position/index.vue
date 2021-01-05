<template>
  <div>
    <!--基本操作-->
    <div>调整位置</div>
    <div>
      <button @click="changePosition('left')">left</button>
      <button @click="changePosition('center')">center</button>
      <button @click="changePosition('right')">right</button>
    </div>
    <div>
      <button @click="changePosition('top')">top</button>
      <button @click="changePosition('middle')">middle</button>
      <button @click="changePosition('bottom')">bottom</button>
    </div>
  </div>

</template>

<script>
export default {
  name: "index",
  data(){
  return {}
  },
  methods:{
    minMaxFn(arr){
      let minX= 10000000,minY = 10000000
      if(arr.length > 1 ) {
        arr.forEach(item=>{
          let {left,top,} = item.attrs
          minX = Math.min( left, minX )
          minY = Math.min( top, minY )
        })
        let objX = {}, objY = {}
        objX =   arr.reduce(function (pre, curv) {
          return pre.attrs.left <= curv.attrs.left ? curv.attrs : pre.attrs;
        });
        objY =   arr.reduce(function (pre, curv) {
          return pre.attrs.top <= curv.attrs.top ? curv.attrs : pre.attrs;
        });
        return {
          left:minX,
          right:objX.left,
          top:minY,
          bottom:objY.top,
          width: objX.width,
          height: objY.height,
        }
      }
    },
    changePosition(flag){
      const selectWidgets = this.$store.getters.selectWidgets //获取当前选中的所有控件
      let obj = {}
      if(selectWidgets.length == 1) {
        let selectWidget = selectWidgets[0]
        if(flag == 'left') {
          obj.left = 0
        } else if(flag =='right') {
           obj.left = this.$store.state.apply.width - selectWidget.attrs.width
        }else if(flag =='top') {
          obj.top = 0
        }else if(flag =='bottom') {
          obj.top =  this.$store.state.apply.height - selectWidget.attrs.height
        } else if(flag =='center') {
          obj.left = (this.$store.state.apply.width - selectWidget.attrs.width ) / 2
        }else  if(flag =='middle') {
          obj.top = (this.$store.state.apply.height - selectWidget.attrs.height ) / 2
        }
      } else {
        let item = this.minMaxFn(selectWidgets)
        console.log(item)
        if(flag == 'left') {
          obj.left = item.left
        } else if(flag =='right') {
          obj.left = item.right
        }else if(flag =='top') {
          obj.top = item.top
        }else if(flag =='bottom') {
          obj.top = item.bottom
        } else if(flag =='center') {
          if(item.left != item.right) {
            obj.left = (item.left + item.right + item.width ) / 2
          }
        }else  if(flag =='middle') {
          if(item.top != item.bottom) {
            obj.top = ( item.top + item.bottom + item.height ) / 2
          }
        }
      }
      this.$store.commit('updateWidgetAttrsPatch',obj )
    },
  }

}
</script>

<style scoped>

</style>

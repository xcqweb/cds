<template>
  <div :style="objStyle">
    <template v-if="widget.active">
      <div 
        class="handle" 
        :style="startStyle" 
        @mousedown="mousedown" 
      />
      <div 
        class="handle" 
        :style="endStyle"
        @mousedown="mousedown" 
      />
    </template>
  </div>
</template>
<script>
const cursors = ['e-resize','se-resize','s-resize','sw-resize','w-resize','nw-resize','n-resize','ne-resize']
export default {
  name:'DragLine',
  props:{
    widget:Object
  },
  computed:{
    objStyle() {
      const {left,top,width,height} = this.widget.attrs
      return {
        position:'absolute',
        top: `${top}px`,
        left: `${left}px`,
        width: `${width}px`,
        height: `${height}px`,
      }
    },
    rotate() {
      const {rotate} = this.widget.attrs
      return rotate
    },
    cursor() {
      let resIndex = Math.floor((this.rotate + 23)/45)
      return cursors[resIndex]
    },
    startStyle() {
      const {width,height} = this.widget.attrs
      let left = -9
      let top = -9
      if(this.rotate>90&&this.rotate<180||this.rotate>270) {
        left = width - 9
      }
      return {
        cursor:this.cursor,
        left:`${left}px`,
        top:`${top}px`,
      }
    },
    endStyle() {
      const {width,height} = this.widget.attrs
      let left = width - 9
      let top = height - 9
      if(this.rotate>90&&this.rotate<180 || this.rotate>270) {
        left = -9
      }
      return {
        cursor:this.cursor,
        left:`${left}px`,
        top:`${top}px`,
      }
    },
  },
  data() {
    return {
    }
  },
  mounted() {
    this.elBase = document.querySelector("body")
    this.elBase.addEventListener("mousedown", this.deselect, true)
    this.elBase.addEventListener("mouseup", this.mouseup, true)
    this.$nextTick(()=>{
      this.ele = document.querySelector(".viewport")
      this.elBase.addEventListener("mousemove",this.mousemove,true)
    })
    this.widgetAttrs = this.widget.attrs // 这个一定要放在刚开始，因为后面有改动left，要取初始的
  },
  beforeDestroy() {
    this.elBase.removeEventListener("mousedown", this.deselect, true)
    this.elBase.removeEventListener("mouseup", this.mouseup, true)
    this.elBase.removeEventListener("mousemove",this.mousemove,true)
  },
  methods: {
    deselect(e) {
      const target = e.target || e.srcElement
      if(!this.$el.contains(target)) {
        if(this.widget.active) {
          this.$store.commit('updateWidgetAttrs',{active:false,cid:this.widget.cid})
        }
      }
    },
    mousedown(evt) {
      let {x,y} = evt
      this.resizing = true
      let { left, top } = this.ele.getBoundingClientRect()
      this.basePos = {x:left,y:top}
      let {left:l,top:t} = this.widgetAttrs
      let spos = {x:l,y:t}
      let epos = {x:x-this.basePos.x,y:y-this.basePos.y}
      let width = epos.x-spos.x
      let height = epos.y-spos.y
      let rotate = this.getAngle(width,height)
      console.log(this.basePos,spos,epos,width,height,rotate,'--down')
    },
    mousemove(evt) {
      if(this.resizing) {
        let { x, y } = evt
        let {left,top} = this.widgetAttrs
        let spos = {x:left,y:top}
        let epos = {x:x-this.basePos.x,y:y-this.basePos.y}
        let width = epos.x-spos.x
        let height = epos.y-spos.y
        let rotate = this.getAngle(width,height)
         console.log(this.basePos,spos,epos,width,height,rotate,'--move')
        width = Math.abs(width)
        height = Math.abs(height)
        width = Math.max(1,width)
        height = Math.max(1,height)
        if(rotate>90&&rotate<=180) {
          left = left - width
        }else if(rotate>180&&rotate<=270) {
          left = left - width
          top = top - height
        }else if(rotate>270) {
          top = top - height
        }
        this.$store.commit('updateWidgetAttrs',{width,height,left,top,cid:this.widget.cid,rotate})
      }
    },
    mouseup(evt) {
      this.resizing = false
      let {x,y} = evt
      let {left:l,top:t} = this.widget.attrs
      let spos = {x:l,y:t}
      let { left, top } = this.ele.getBoundingClientRect()
      this.basePos = {x:left,y:top}
      let epos = {x:x-this.basePos.x,y:y-this.basePos.y}
      let width = epos.x-spos.x
      let height = epos.y-spos.y
      let rotate = this.getAngle(width,height)
      console.log(this.basePos,spos,epos,width,height,rotate,'---up')
    },
    getAngle(x, y) {
      let theta = Math.atan2(y, x) // range (-PI, PI]
      theta = Math.round((180 / Math.PI) * theta) // rads to degs, range (-180, 180]
      if (theta < 0) theta = 360 + theta // range [0, 360)
      return theta
    }
  },
}
</script>
<style lang="less" scoped>
.handle {
  position: absolute;
  width: 18px;
  height: 18px;
  border: none;
  pointer-events: auto;
  background: url("~@/assets/images/icon/resize-dot.svg") 100% 100%;
}
</style>
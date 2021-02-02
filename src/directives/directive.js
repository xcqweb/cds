import Vue from "vue"

function deal(el, isVisible) {
  if (isVisible.value) {
    el.style.visibility = "visible"
  } else {
    el.style.visibility = "hidden"
  }
}

Vue.directive("visible", {
  update: function(el, isVisible) {
    deal(el, isVisible)
  },
  inserted: function(el, isVisible) {
    deal(el, isVisible)
  }
})
Vue.directive("focus", {
  inserted: function(el) {
    el.focus()
    if (el.select) {
      el.select()
    } else {
      const range = document.createRange()
      range.selectNodeContents(el)
      document.getSelection().removeAllRanges()
      document.getSelection().addRange(range)
    }
  }
})
Vue.directive("clickOutSide", {
  bind: function(el, { value }) {
    let clickOutSide
    if (value.cb) {
      clickOutSide = value.cb
    } else {
      clickOutSide = value
    }
    el.handler = function(e) {
      let elExclude = []
      if (value.elExclude) {
        value.elExclude.forEach(item=>{
          let tempEle = document.querySelector(`.${item}`)
          if(tempEle) {
            elExclude.push(tempEle)
          }
        })
      }
      if (el && !el.contains(e.target)) {
        let resFlag = true
        if(elExclude.length) {
          elExclude.forEach(item=>{
            if(item.contains(e.target)) {
              resFlag = false
            }
          })
        }
        if (!elExclude.length || resFlag) {
          clickOutSide(e)
        }
      }
    }
    document.addEventListener("click", el.handler, true)
  },
  unbind: function(el) {
    document.removeEventListener("click", el.handler, true)
    el.handler = null
  }
})

Vue.directive("inputNumber", {
  bind: function(el,{ value }) {
    const tempEl = el.firstChild
    el.handler = function() {
      let res = Number(tempEl.value.replace(/\D+/, ''))
      if(value.max) {
        res = Math.min(res,value.max)
      }
      if(value.min || value.min === 0) {
        res = Math.max(res,value.min)
      }
      tempEl.value = res
    }
    tempEl.addEventListener('input', el.handler)
  },
  unbind: function(el) {
    const tempEl = el.firstChild
    tempEl.removeEventListener('input', el.handler)
  }
})


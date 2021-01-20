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
    if(value.cb) {
      clickOutSide = value.cb
    } else {
      clickOutSide = value
    }
    el.handler = function(e) {
      let elExclude
      if(value.elExclude) {
        elExclude = document.querySelector(`.${value.elExclude}`)
      }
      if (el && !el.contains(e.target)) {
        if(!elExclude || !elExclude.contains(e.target)) { 
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

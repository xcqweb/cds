import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"
import Antd from "ant-design-vue"
import "ant-design-vue/dist/antd.css"
import "./assets/styles/common.less"
Vue.config.productionTip = false
Vue.use(Antd)
const bus = new Vue()
Vue.prototype.$bus = bus
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app")
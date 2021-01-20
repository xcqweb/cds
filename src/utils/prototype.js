import Vue from "vue"
import moment from "moment"
import "moment/locale/zh-cn"
moment.locale("zh-cn")
// 时间
Vue.prototype.$moment = moment
// 常用格式化时间
Vue.prototype.$formatDate = (timestamp, fmt = "YYYY-MM-DD HH:mm:ss") => {
  return timestamp ? moment(timestamp).format(fmt) : ""
}
// 图片预览
Vue.prototype.$imgUrl = function(url) {
  if (!url || /(http|https)?:\/\//.test(url.toString())) {
    return url
  }
  if (!url.startsWith("/")) {
    url = "/" + url
  }
  if (process.env.NODE_ENV === "development") {
    return "http://kong.poros-platform.10.74.158.69.nip.io" + url
  }
  return url
}
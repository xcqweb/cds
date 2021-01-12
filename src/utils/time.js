export function currentTime(myDate, flag) {
  let year = myDate.getFullYear() // 获取完整的年份(4位,1970-????)
  let month = change(myDate.getMonth()) // 获取当前月份(0-11,0代表1月)
  let day = change(myDate.getDate()) // 获取当前日(1-31)
  let hour = change(myDate.getHours()) // 获取当前小时数(0-23)
  let min = change(myDate.getMinutes()) // 获取当前分钟数(0-59)
  let second = change(myDate.getSeconds()) // 获取当前秒数(0-59)
  function change(t) {
    if (t < 10) {
      return "0" + t
    } else {
      return t
    }
  }

  if (flag == "time") {
    return hour + ":" + min + ":" + second
  } else {
    return (
      year + "-" + month + "-" + day + "  " + hour + ":" + min + ":" + second
    )
  }
}

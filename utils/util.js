var formatTime = function (target) {
  if (!target) return target // 第一次渲染wxs 可能会 undefined 数据穿入
  var regx = new RegExp("-", "g") // ios 不能识别 '-' 作为时间分割。。。 这也太奇葩啦还好能百度到
  var targetTime = new Date(target.replace(regx, '/'))
  var nowTime = new Date()

  var deltaTime = Math.floor((nowTime.getTime() - targetTime.getTime()) / 1000)

  var year = targetTime.getFullYear()
  var month = targetTime.getMonth()
  var date = targetTime.getDate()
  var hours = targetTime.getHours()
  var minutes = targetTime.getMinutes()
  var seconds = targetTime.getSeconds()


  var oneYear = 31536000
  var oneMonth = 2592000
  var oneDay = 86400
  var oneHour = 3600
  var oneMinute = 60
  var oneSecond = 1

  if (deltaTime <= oneMinute) {
    return deltaTime + '秒前'
  }

  if (deltaTime <= oneHour) {
    return Math.floor(deltaTime / 60) + '分钟前'
  }

  if (deltaTime <= oneDay) {
    return Math.floor(deltaTime / 60 / 60) + '小时前'
  }

  if (deltaTime <= (oneDay * 2)) {
    return '昨天'
  }

  if (deltaTime <= oneYear) {
    return [month, date].join('-')
  }

  if (deltaTime > oneMonth) {
    return [year, month, date].join('-')
  }

  return target
}

const formatFullTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatSimpleDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join('-')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 节流工具类
let timeoutId = null

const throtting = (callback, delay = 200) => {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
  timeoutId = setTimeout(callback, delay)
}

function S4() {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}
function guid() {
  return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

const uuid = () => {
  return 'cms' + guid()
}

module.exports = {
  formatTime,
  formatFullTime,
  formatSimpleDate,
  throtting,
  uuid
}

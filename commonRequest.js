var app = getApp()
var host = require('./config.js').host

const request = function (url, method, data) {
  wx.showToast({
    icon: 'loading',
    title: '加载中',
    mask: true,
    duration: 10000
  })
  wx.showNavigationBarLoading()
  if (app.globalData.logining) return Promise.reject()
  if (!app.globalData.tokenBody.token) {
    app.globalData.logining = true;
  }
  return new Promise(function (resolve, reject) {
    wx.request({
      url: host + url,
      data: data,
      header: {
        'content-type': 'application/json',
        'X-Auth-Token': app.globalData.tokenBody.token
      },
      method: method || 'GET',
      success: function (response) {
        wx.hideToast()
        wx.hideNavigationBarLoading()
        const res = response.data
        console.log(response)
        if (response.statusCode == 403) {
          app.login({ fromUid: app.globalData.fromUid });
          return;
        }
        if (res.error) {
          wx.showToast({
            title: res.error.message,
            icon: 'none',
          })
          reject(res)
        }
        resolve(res)
      },
      fail: function (res) {
        wx.hideNavigationBarLoading()
        wx.showToast({
          title: '网络错误',
          icon: 'none',
        })
        reject(res)
      }
    })
  })
}

module.exports.request = request
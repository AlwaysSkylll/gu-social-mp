var app = getApp()
var host = require('./config.js').host

module.exports.request = function (url, method, data) {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: host + url,
      data: data,
      header: {
        'content-type': 'application/json',
        'X-Auth-Token': app.globalData.tokenBody.token
        // 'X-Auth-Token': app.globalData.testToken
      },
      method: method || 'GET',
      success: function (response) {
        const res = response.data
        console.log(response)
        if (response.statusCode == 403) {
          app.login();
          return;
        }
        if (res.error) {
          wx.showToast({
            title: res.error.message,
            icon: 'none',
          })
          reject(res)
        } else {
          resolve(res)
        }
      },
      fail: function (res) {
        reject(res)
      }
    })
  })
}

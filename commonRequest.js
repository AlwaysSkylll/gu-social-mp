var app = getApp()

module.exports.request = function (url, method, data) {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: "https://leixiaoguan.browqui.com" + url,
      data: data,
      header: {
        'content-type': 'application/json',
        'X-Auth-Token': app.globalData.authToken
      },
      method: method || 'GET',
      success: function (response) {
        const res = response.data
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

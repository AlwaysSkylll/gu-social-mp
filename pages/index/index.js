//index.js
//获取应用实例
const app = getApp()
const api = require('../../api/index.js')

Page({
  data: {
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    if (app.globalData.userInfo) {
      const userInfo = app.globalData.userInfo
      this.getToken(userInfo)
      // this.setData({
      //   hasUserInfo: true
      // })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      // app.userInfoReadyCallback = res => {
      //   this.setData({
      //     hasUserInfo: true
      //   })
      // }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.getToken(res.userInfo)
          // this.setData({
          //   hasUserInfo: true
          // })
        }
      })
    }
  },
  onReady() {
  },
  switchHomeTab() {
    wx.switchTab({
      url: '/pages/home/index'
    })
  },
  getUserInfo(e) {
    console.log(e)
    const userInfo = e.detail.userInfo
    if (!userInfo) {
      return;
    }
    app.globalData.userInfo = userInfo
    this.getToken(userInfo)
  },
  getToken(userInfo) {
    const self = this
    wx.login({
      success(res) {
        if (res.code) {
          console.log('get code success')
          api.login({
            code: res.code,
            gender: userInfo.gender,
            nickname: userInfo.nickName,
            avatar_url: userInfo.avatarUrl
          }).then(res => {
            console.log(res)
            app.globalData.userInfo = res.user
            app.globalData.tokenBody = res.token
            self.switchHomeTab()
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '获取用户失败',
          })
        }
      }
    })
  }
})

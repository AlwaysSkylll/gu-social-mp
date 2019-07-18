//app.js
var host = require('./config.js').host
require('./utils/mixin.js')

App({
  onLaunch: function () {
    const self = this
    wx.hideTabBar({})

    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    wx.getSystemInfo({
      success: function (res) {
        //model中包含着设备信息
        console.log(res.model)
        const model = res.model
        self.globalData.isIpx = model.search('iPhone X') != -1;
      }
    })

    self.globalData.intervalId = setInterval(() => {
      self.globalData.intervalList.map(item => {
        item.callback.call(item.self)
      })
    }, 1000);
  },

  addIntervalEvent(callback, self, uuid) {
    for (let [key, value] of this.globalData.intervalList.entries()) {
      if (value.uuid === uuid) {
        return;
      }
    }
    this.globalData.intervalList.push({
      callback,
      self,
      uuid
    })
    console.log(this.globalData.intervalList, 'add intervalList')

  },

  removeIntervalEvent(uuid) {
    for (let [key, value] of this.globalData.intervalList.entries()) {
      console.log(key, uuid, 'compare uuid')
      console.log(value.uuid, uuid, 'compare uuid')
      if (value.uuid === uuid) {
        this.globalData.intervalList.splice(key, 1)
      }
    }
    console.log(this.globalData.intervalList, 'remove intervalList')
  },

  login(callback) {
    const self = this
    // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //   }
    // })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              self.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              self.getToken(res.userInfo, callback)
            }
          })
        } else {
          self.globalData.logining = false;
          wx.navigateTo({
            url: '/pages/index/index',
          })
        }
      }
    })
  },
  getToken(userInfo, callback) {
    const self = this
    
    wx.login({
      success(res) {
        if (res.code) {
          console.log('get code success')
          self.requestToken({
            code: res.code,
            gender: userInfo.gender,
            nickname: userInfo.nickName,
            avatar_url: userInfo.avatarUrl
          }).then(res => {
            console.log(res)
            wx.setStorageSync('userInfo', res.user)
            self.globalData.userInfo = res.user
            self.globalData.tokenBody = res.token
            self.globalData.logining = false;
            callback && callback()
            self.userInfoReadyCallback && self.userInfoReadyCallback()

            const pages = getCurrentPages()
            if (pages.length === 1) {
              self.globalData.needRefresh = true
              pages[0].onShow()
            } else {
              self.globalData.needRefresh = true
              wx.navigateBack({
                delta: 1
              })
            }
          })
        } else {
          self.globalData.logining = false;
          wx.showToast({
            icon: 'none',
            title: '获取用户失败',
          })
        }
      },
      fail(res) {
        self.globalData.logining = false;        
      }
    })
  },
  requestToken(data) {
    return new Promise(function (resolve, reject) {
      wx.request({
        url: host + '/api/tokens',
        data,
        header: {
          'content-type': 'application/json',
        },
        method: 'POST',
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
  },
  requestSaveImgPermission() {
    wx.showModal({
      content: '检测到您没打开保存至相册的权限，是否去设置打开？',
      confirmText: "确认",
      cancelText: "取消",
      success: function (res) {
        console.log(res);
        //点击“确认”时打开设置页面
        if (res.confirm) {
          console.log('用户点击确认')
          wx.openSetting({
            success: (res) => { }
          })
        } else {
          console.log('用户点击取消')
        }
      }
    });
  },
  globalData: {
    logining: false,
    needRefresh: false,
    userInfo: null,
    testToken: 'lGV0HK8F8fKIJCvW4pyY6QSU4xAtXq4n',
    tokenBody: {},
    intervalId: 0,
    intervalList: [],
  }
})
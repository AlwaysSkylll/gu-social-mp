const api = require('../../api/index.js')
const app = getApp()

Page({
  data: {
    tabs: [
      "罍小说",
      // "我的消息",
      // "个人中心"
    ],
    tabIndex: 0,
    myEvents: [],
    offset: 0,
    limit: 10,
    finish: false,
    userInfo: {},
    isIpx: app.globalData.isIpx
  },
  onLoad: function () {
  },
  onReady() {
    wx.hideTabBar({})
  },
  onShow() {
    wx.hideTabBar({})
    this.getData()
  },
  myTabHandler(e) {
    const tabIndex = e.detail.tabIndex
    this.setData({
      tabIndex
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getMyEvents()
  },

  getData() {
    this.setData({
      finish: false,
      offset: 0,
      myEvents: []
    })
    this.getMyEvents()
    this.getUserInfo()
    wx.stopPullDownRefresh();
  },

  /**
   * 获取我的说说
   */
  getMyEvents() {
    if (this.data.finish) {
      return
    }
    const param = {
      offset: this.data.myEvents.length,
      limit: this.data.limit,
    }
    api.myEvents(param).then(res => {
      const myEvents = [...this.data.myEvents, ...res.data]
      const finish = res.paging.total <= myEvents.length

      this.setData({
        myEvents,
        finish
      })
    })
  },

  /**
   * 获取用户信息
   */
  getUserInfo() {
    api.getUserInfo({}).then(res => {
      const userInfo = res

      this.setData({
        userInfo,
      })
    })
  },
  
  /**
   * 上传图片
   */
  uploadImg(e) {
    const self = this

    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      success: (e) => {
        console.log(e, 'success')
        const toBase64Images = 'data:image/jpeg;base64,' + wx.getFileSystemManager().readFileSync(e.tempFilePaths[0], 'base64')
        api.uploadImage({ image: toBase64Images }).then(({url}) => {
          console.log(url, 'uploadImage')
          api.setUserInfo({
            background: url
          }).then(res => {
            this.setData({
              ['userInfo.background']: url
            })
            console.log(res, 'modified userinfo')
          })
        })
      },
      fail: (e) => {
        console.log(e, 'fail')
      }
    })
  },
  /**
   * 预览图片
   */
  preview(e) {
    const index = e.currentTarget.dataset.index
    const imgLink = this.data.topic.images[index]
    if (!imgLink) {
      return;
    }
    wx.previewImage({
      current: imgLink,
      urls: this.data.topic.images
    })
  },

  goInvite() {
    wx.navigateTo({
      url: '/pages/invite/index',
    })
  }
});

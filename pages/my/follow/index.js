// pages/my/follow/index.js
const api = require('../../../api/index.js')
// const app = getApp()

Page({
  mixins: [
    require('../../../mixins/gift-mixin/index.js')
  ],
  /**
   * 页面的初始数据
   */
  data: {
    // myEvents: [],
    offset: 0,
    limit: 15,
    finish: false,
    users: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // this.getMyEvents()
    this.getFollowes()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  getData() {
    this.setData({
      finish: false,
      offset: 0,
      myEvents: []
    })
    // this.getMyEvents()
    this.getFollowes()

    wx.stopPullDownRefresh();
  },
  

  getFollowes() {
    if (this.data.finish) {
      return
    }
    const param = {
      offset: this.data.users.length,
      limit: this.data.limit,
    }
    api.getFollower(param).then(res => {
      const users = [...this.data.users, ...res.data]
      const finish = res.paging.total <= users.length

      this.setData({
        users,
        finish
      })
    })
  },

  /**
   * 获取我的说说
   */
  // getMyEvents() {
  //   if (this.data.finish) {
  //     return
  //   }
  //   const param = {
  //     offset: this.data.myEvents.length,
  //     limit: this.data.limit,
  //   }
  //   api.myEvents(param).then(res => {
  //     const myEvents = [...this.data.myEvents, ...res.data]
  //     const finish = res.paging.total <= myEvents.length

  //     this.setData({
  //       myEvents,
  //       finish
  //     })
  //   })
  // },
})
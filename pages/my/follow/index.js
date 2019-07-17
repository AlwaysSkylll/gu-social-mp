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
    myEvents: [],
    offset: 0,
    limit: 10,
    finish: false,
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
    this.getMyEvents()
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
    this.getMyEvents()
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
})
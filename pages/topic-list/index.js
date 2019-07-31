// pages/topic-list/index.js
const api = require('../../api/index.js')
const app = getApp()

Page({
  mixins: [require('../../mixins/stick-btn-mixin/index.js')],
  /**
   * 页面的初始数据
   */
  data: {
    topics: [],
    limit: 15,
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
    if (app.globalData.needRefresh === true) {
      app.globalData.needRefresh = false
      this.getData()
    }
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
    this.setData({
      offset: 0,
      topics: [],
      finish: false,
    })
    this.getData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getData();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  getData() {
    if (this.data.finish) {
      return
    }
    const param = {
      offset: this.data.topics.length,
      limit: this.data.limit,
    }
    api.searchSubject(param).then(res => {
      const topics = [...this.data.topics, ...res.data]
      const finish = res.paging.total <= topics.length

      this.setData({
        topics,
        finish
      })
      wx.stopPullDownRefresh()
    })
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/topic-detail/index?id=${id}&type=Subject`,
    })
  }
})
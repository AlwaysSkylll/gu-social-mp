// pages/circle-list/index.js
const api = require('../../api/index.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    circles: [],
    limit: 10,
    finish: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    this.getData()
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
      circles: [],
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
      offset: this.data.circles.length,
      limit: this.data.limit,
    }
    api.getCircles(param).then(res => {
      const circles = [...this.data.circles, ...res.data]
      const finish = res.paging.total <= circles.length

      this.setData({
        circles,
        finish
      })
      wx.stopPullDownRefresh()
    })
  },

  toDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/topic-detail/index?id=${id}&type=Circle`,
    })
  }
})
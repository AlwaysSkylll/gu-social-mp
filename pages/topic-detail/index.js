// pages/topic-detail/index.js
const api = require('../../api/index.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    subject: {},
    events: [],
    id: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  getData() {
    this.getSubjectEvents()
    this.getSubject()
  },
  
  /**
   * 获取话题下的说手
   */
  getSubjectEvents() {
    api.getSubjectEvents({}, this.data.id).then(res => {
      this.setData({
        events: res.data
      })
    })
  },

  /**
   * 获取话题
   */
  getSubject() {
    api.getSubjectDetail({}, this.data.id).then(res => {
      this.setData({
        subject: res
      })
    })
  }
})
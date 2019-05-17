// pages/topic-detail/index.js
const api = require('../../api/index.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: null,
    total: 0,
    comments: [],
    focusArea: false,
    comment: {
      context: '',
      event_id: '',
      target_user_id: ''
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    api.getEventDetail({}, options.id).then(res => {
      this.setData({
        item: res
      })
    })

    api.getEventsComments({}, options.id).then(res => {
      this.setData({
        comments: res.data,
        total: res.paging.total
      })
    })
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

  showRealComment() {
    this.setData({
      focusArea: true
    })
  },

  hideRealComment() {
    this.setData({
      focusArea: false
    })
  },

  toolOperation(e) {
    const target = e.currentTarget
    console.log(target)
    return;
  },

  mention(e) {
    console.log(e, 'mention')
  },

  send(e) {
    console.log(e, 'send')
    if (!this.data.comment.context) {
      return;
    }
    api.commentEvent({
      content: this.data.comment.context,
      event_id: this.data.item.id,
      target_user_id: this.data.comment.target_user_id,
    }).then(res => {
      this.setData({
        [`comment.context`]: '',
        ['comments']: [res, ...this.data.comments],
        focusArea: false,
      })
      wx.showToast({
        title: '评论成功',
      })
    })
  },

  /**
   * 更新文本
   */
  updateContext(e) {
    console.log(e)
    this.setData({
      [`comment.context`]: e.detail.value
    })
  },
})
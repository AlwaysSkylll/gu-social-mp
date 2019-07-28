// pages/topic-detail/index.js
const api = require('../../api/index.js')
const app = getApp()

Page({
  mixins: [
    require('../../mixins/gift-mixin/index.js'),
    require('../../mixins/stick-btn-mixin/index.js')
  ],
  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    item: null,
    total: 0,
    comments: [],
    focusArea: false,
    focusAreaDelyed: false,
    comment: {
      context: '',
      event_id: '',
      target_user_id: ''
    },
    placeholder: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)

    const randomPlace = ['有想法？别藏着', '想说什么就说什么', '别矜持，随便整几句', '评论是建立友谊的第一步']
    const randomIndex = Math.floor(Math.random() * 4)

    this.setData({
      placeholder: randomPlace[randomIndex],
      id: options.id
    })

    this.getData()

  },

  getData() {
    api.getEventDetail({}, this.data.id).then(res => {
      this.setData({
        item: res
      })
    })

    api.getEventsComments({}, this.data.id).then(res => {
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

  setFocus(status) {
    this.setData({
      focusArea: status
    })
    setTimeout(() => {
      this.setData({ focusAreaDelyed: status })
    }, 500)
  },

  showRealComment() {
    this.setFocus(true)
  },

  hideRealComment() {
    this.setFocus(false)
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
      const commentNum = this.data.item.comment_num + 1
      this.setData({
        // [`comment.context`]: '',
        ['comments']: [res, ...this.data.comments],
        ['item.comment_num']: commentNum,
        ['comment.context']: ''
      })
      this.setFocus(false)
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
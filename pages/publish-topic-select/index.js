// pages/publish-topic-select/index.js
const api = require('../../api/index.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    topics: [],
    type: '',
    id: '',
    limit: 15,
    offset: 0,
    finish: false,
    inputShowed: false,
    searchContent: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const type = options.type || ''
    const id = options.id || 0
    const param = type === 'Circle' ? { circles_id: id } : {}
    this.setData({
      type,
      id, 
    })

    this.getData()
  },

  getData() {
    if (this.data.finish) return
    if (this.data.type === 'Circle') {
      wx.setNavigationBarTitle({
        title: '选择圈子'
      })
      api.getCircles({ ...this.data.param, offset: this.data.offset, limit: this.data.limit, title: this.data.searchContent }).then(({ data, paging }) => {
        const topics = [...this.data.topics, ...data]
        const offset = topics.length
        const finish = paging.total <= offset
        this.setData({ topics, offset, finish })
      })
      return
    } else if (this.data.type === 'Subject') {
      wx.setNavigationBarTitle({
        title: '选择话题'
      })

      api.searchSubject({ ...this.data.param, offset: this.data.offset, limit: this.data.limit, title: this.data.searchContent }).then(({ data, paging }) => {
        const topics = [...this.data.topics, ...data]
        const offset = topics.length
        const finish = paging.total <= offset
        this.setData({ topics, offset, finish })
      })
    } else if (this.data.type === 'Activity') {
      wx.setNavigationBarTitle({
        title: '选择活动'
      })

      api.getActivities({ ...this.data.param, offset: this.data.offset, limit: this.data.limit, title: this.data.searchContent }).then(({ data, paging }) => {
        const topics = [...this.data.topics, ...data]
        const offset = topics.length
        const finish = paging.total <= offset
        this.setData({ topics, offset, finish })
      })
    }
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
    this.getData()
  },

  selectItem(e) {
    const index = e.currentTarget.dataset.index
    const pages = getCurrentPages();   //当前页面
    const prevPage = pages[pages.length - 2];   //上一页面
    prevPage.selectTopic(this.data.topics[index])
    wx.navigateBack({})
  },

  inputTyping: function (e) {
    this.setData({
      searchContent: e.detail.value
    });
  },

  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },

  hideInput: function () {
    this.setData({
      searchContent: '',
      inputShowed: false
    });
  },

  clearInput: function () {
    this.setData({
      searchContent: '',
    });
  },

  searchItems() {
    this.setData({
      offset: 0,
      finish: false,
      topics: []
    })
    this.getData()
  },
})
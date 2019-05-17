// pages/publish-topic-select/index.js
const api = require('../../api/index.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    topics: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    api.searchSubject({}).then(({data}) => {
      this.setData({
        topics: data,
        showModal: true
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

  selectItem(e) {
    const index = e.currentTarget.dataset.index
    const pages = getCurrentPages();   //当前页面
    const prevPage = pages[pages.length - 2];   //上一页面
    prevPage.selectTopic(this.data.topics[index])
    wx.navigateBack({})
  }
})
// pages/my/gift/index.js
const api = require('../../../api/index.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabItems: [
      {
        label: '礼物来源记录',
        slotName: 'received'
      },
      {
        label: '赠送兑换记录',
        slotName: 'give'
      }
    ],
    received: [],
    give: [],
    paging: undefined,
    activeTabIndex: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: res => {
        const scrollHeight = res.windowHeight - 100
        this.setData({
          scrollHeight,
        })
      }
    })

    this.getList('received', 0)
    this.getList('give', 0);
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
    // 发起请求，更新订单活动列表
    this.data.received = []
    this.data.give = []
    this.getList('received', 0)
    this.getList('give', 0);
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

  switchTabListener(e) {
    const activeTabIndex = e.detail.index
    this.setData({ activeTabIndex })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  scrolltolowerListener(e) {
    const activeTabIndex = this.data.activeTabIndex
    const tabItems = this.data.tabItems
    const type = tabItems[activeTabIndex].slotName
    const list = this.data[type]
    const total = this.data.paging && this.data.paging[type] && this.data.paging[type].total

    if (!total || total <= list.length) {
      return;
    }

    this.getList(type, list.length)
  },

  getList(type, offset) {
    const tabItems = this.data.tabItems
    let list = this.data[type]

    const callBack = (res) => {
      wx.stopPullDownRefresh()
      list = list.concat(res.data)
      this.setData({
        [type]: list,
        [`paging.${type}`]: res.paging,
        showMoreLoading: false
      })
    }

    if (type === tabItems[0].slotName) {
      return api.myGift({ offset, type: 'received' }).then(callBack)
    }
    if (type === tabItems[1].slotName) {
      return api.myGift({ offset, type: 'give' }).then(callBack)
    }
  },
})
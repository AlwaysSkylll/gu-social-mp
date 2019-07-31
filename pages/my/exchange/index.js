// pages/my/exchange/index.js
const api = require('../../../api/index.js')

Page({
  mixins: [require('../../../mixins/stick-btn-mixin/index.js')],
  /**
   * 页面的初始数据
   */
  data: {
    tabItems: [
      {
        label: '礼品兑换',
        slotName: 'goods'
      },
      {
        label: '我的兑换',
        slotName: 'mychange'
      }
    ],
    goods: [],
    mychange: [],
    paging: undefined,
    activeTabIndex: 0,
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: res => {
        const scrollHeight = res.windowHeight - 85
        this.setData({
          scrollHeight,
        })
      }
    })
    const userInfo = wx.getStorageSync('userInfo')
    this.setData({ userInfo })
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
    this.getUserInfo();
    this.setData({
      goods: [],
      mychange: [],
      paging: {},
    })

    this.getList('goods', 0)
    this.getList('mychange', 0);
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
    this.data.goods = []
    this.data.mychange = []
    this.getList('goods', 0)
    this.getList('mychange', 0);
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
      return api.getProducts({ offset }).then(callBack)
    }
    if (type === tabItems[1].slotName) {
      return api.getOrders({ offset }).then(callBack)
    }
  },

  buyProduct(e) {
    const id = e.currentTarget.dataset.id;
    console.log(e)
    wx.navigateTo({
      url: `/pages/my/activity-address/index?id=${id}`,
    })
  },

  /**
   * 获取用户信息
   */
  getUserInfo() {
    api.getUserInfo({}).then(res => {
      const userInfo = res
      wx.setStorageSync('userInfo', res)

      this.setData({
        userInfo,
      })
    })
  },

  /**
   * 显示物流信息
   */
  showExpressStatus(e) {
    const self = this
    const index = e.currentTarget.dataset.index
    const item = this.data.mychange[index]
    console.log(index, this.data.mychange)
    if (item.express) {
      wx.showModal({
        title: '物流',
        content: `${item.express}: ${item.express_num}`,
        confirmText: '复制单号',
        success(res) {
          if(res.confirm) {
            wx.setClipboardData({
              data: item.express_num,
              success: () => {
                wx.showToast({
                  title: '已复制到剪切板',
                })
              }
            })
          } else if(res.cancel) {
          }
        }
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: '暂无物流信息',
      })
    }
  }
})
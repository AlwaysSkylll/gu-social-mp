// pages/search/index.js
const api = require('../../api/index.js')
const app = getApp()
const ALL_TAB = {
  SUBJECT: 0,
  CIRCLE: 1,
  ACTIVITY: 2
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    searchContent: '',
    tabs: ['话题', '圈子', '活动'],
    tabIndex: 0,
    result: {
      subject: {
        offset: 0,
        limit: 10,
        data: [],
        finish: false,
      },
      circle: {
        offset: 0,
        limit: 10,
        data: [],
        finish: false,
      },
      activity: {
        offset: 0,
        limit: 10,
        data: [],
        finish: false,
      }
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.showInput()
    console.log(this)
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
    console.log('onReachBottom')

    for (let type of Object.keys(ALL_TAB)) {
      if (this.data.tabIndex == ALL_TAB[type]) {
        this.getList(type.toLocaleLowerCase())
        return
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

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

  tabHandler(e) {
    const tabIndex = e.detail.tabIndex
    this.setData({
      tabIndex
    })
  },

  searchItems() {
    this.setData({
      result: {
        subject: {
          offset: 0,
          limit: 10,
          data: [],
          finish: false,
        },
        circle: {
          offset: 0,
          limit: 10,
          data: [],
          finish: false,
        },
        activity: {
          offset: 0,
          limit: 10,
          data: [],
          finish: false,
        }
      },
    })
    this.getList()
  },

  getList(type) {
    let apiList = {
      activity: 'getActivities',
      subject: 'searchSubject',
      circle: 'getCircles'
    }

    if (type){
      const temp = apiList[type]
      apiList = {}
      apiList[type] = temp
    }

    for (let key of Object.keys(apiList)) {
      console.log(apiList[key])

      if (this.data.result[key].finish) return
      const { offset, limit } = this.data.result[key]

      api[apiList[key]]({ title: this.data.searchContent, offset, limit }).then(res => {
        const data = [...this.data.result[key].data, ...res.data]
        const finish = res.paging.total <= data.length
        this.setData({
          [`result.${key}.offset`]: data.length,
          [`result.${key}.data`]: data,
          [`result.${key}.finish`]: finish
        })
      })
    }
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id

    if (this.data.tabIndex == ALL_TAB.SUBJECT) {
      wx.navigateTo({
        url: `/pages/topic-detail/index?id=${id}&type=Subject`,
      }) 
      return
    }

    if (this.data.tabIndex == ALL_TAB.CIRCLE) {
      wx.navigateTo({
        url: `/pages/topic-detail/index?id=${id}&type=Circle`,
      })
      return
    }

    if (this.data.tabIndex == ALL_TAB.ACTIVITY) {
      wx.navigateTo({
        url: `/pages/topic-detail/index?id=${id}&type=Circle`,
      })
      return
    }
  }
})
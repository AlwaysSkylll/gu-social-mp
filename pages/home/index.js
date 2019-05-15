const api = require('../../api/index.js')

Page({
    data: {
      mainTabs: [
        "推荐",
        "广场",
        "活动"
      ],
      tabIndex: 0,
      activityTabIndex: 0,
      groundTabIndex: 0,
      circles: [],
      topics: [],
      events: []
    },
    onLoad: function () {
      wx.hideTabBar({})
      this.getData()
    },
    onReady() {
      wx.hideTabBar({})
    },
    mainTabHandler(e) {
      const tabIndex = e.detail.tabIndex
      this.setData({
        tabIndex
      })
    },
    tempTabHandler(e) {
      const type = e.currentTarget.dataset.type
      const tabIndex = e.detail.tabIndex
      const targetName = `${type}TabIndex`
      this.setData({
        [targetName]: tabIndex
      })
    },

    /**
     * 跳转列表页
     */
    goListPage(e) {
      const type = e.currentTarget.dataset.type
      wx.navigateTo({
        url: `/pages/${type}-list/index`,
      })
    },
    
    /**
     * 获取页面所有数据
     */
    getData() {
      this.getCircleData()
      this.getTopicData()
      this.getEventsData()
    },

    /**
     * 获取推荐页圈子数据
     */
    getCircleData() {
      api.getCircles({ limit: 5 }).then(res => {
        const circles = res.data

        this.setData({
          circles,
        })
      })
    },

    /**
     * searchSubject
     * 推荐话题
     */
    getTopicData() {
      api.searchSubject({ limit: 6 }).then(res => {
        const topics = res.data

        this.setData({
          topics,
        })
      })
    },

  /**
   * 获取说说数据
   */
  getEventsData() {
    api.getEvents().then(res => {
      const events = res.data

      this.setData({
        events,
      })
    })
  },
});
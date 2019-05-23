const api = require('../../api/index.js')
const app = getApp()

Page({
    data: {
      mainTabs: [
        "推荐",
        "广场",
        // "活动"
      ],
      tabIndex: 0,
      activityTabIndex: 0,
      groundTabIndex: 0,
      circles: [],
      topics: [],
      events: [
        [],
        []
      ],
      finish: [false, false],
      swipers: [],
      isIpx: app.globalData.isIpx
    },
    onLoad() {
      wx.hideTabBar({})
      this.getData();
    },
    onReady() {
      
    },
    onShow() {
      if (app.globalData.needRefresh === true) {
        app.globalData.needRefresh = false
        this.getData()
      }
    },

    /**
    * 页面相关事件处理函数--监听用户下拉动作
    */
    onPullDownRefresh() {
      if (this.data.tabIndex === 0) {
        this.setData({
          circles: [],
          topics: [],
          swipers: [],
        })
        this.getCircleData()
        this.getTopicData()
        this.getSwiper()
        wx.stopPullDownRefresh()
      } else if (this.data.tabIndex === 1) {
        this.setData({
          events: [[], []],
          finish: [false, false],
        })
        this.getEventsData(0)
        this.getEventsData(1)
        wx.stopPullDownRefresh()
      }
    },

    /**
    * 页面相关事件处理函数--监听用户到底的动作
    */
    onReachBottom() {
      console.log('onReachBottom')
      // 广场无限加载
      if (this.data.tabIndex === 1) {
        this.getEventsData(this.data.groundTabIndex)
      }
    },

    /**
     * 分享
     */
    onShareAppMessage(e) {
      console.log(e)
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

    goSwiperDetail(e) {
      const index = e.currentTarget.dataset.index
      if (!(this.data.swipers[index].target && this.data.swipers[index].target.id)) return
      if (this.data.swipers[index].target_type === 'circles') {
        wx.navigateTo({
          url: `/pages/topic-detail/index?id=${this.data.swipers[index].target.id}&type=Circle`
        })
      }
      if (this.data.swipers[index].target_type === 'subjects') {
        wx.navigateTo({
          url: `/pages/topic-detail/index?id=${this.data.swipers[index].target.id}&type=Subject`
        })
      }
    },
    /**
     * 获取页面所有数据
     */
    getData() {
      console.log('home getData')
      this.setData({
        circles: [],
        topics: [],
        events: [[], []],
        finish: [false, false],
        swipers: [],
      })
      this.getCircleData()
      this.getTopicData()
      this.getEventsData(0)
      this.getEventsData(1)
      this.getSwiper()
    },

    getSwiper() {
      api.homeSwiper().then(res => {
        console.log(res, 99999)

        this.setData({
          swipers: res.data
        })
      })
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
    getEventsData(index) {
      if (this.data.finish[index]) return
      const param = {
        offset: this.data.events[index].length,
        sort: index === 0 ? 'hot' : ''
      }
      api.getEvents(param).then(res => {
        const events = [...this.data.events[index], ...res.data]
        const finish = res.paging.total <= this.data.events[index].length
        this.setData({
          [`events[${index}]`]: events,
          [`finish[${index}]`]: finish,
        })
      })
    },
});
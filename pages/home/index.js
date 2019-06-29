const api = require('../../api/index.js')
const app = getApp()

Page({
  mixins: [require('../../mixins/stick-btn-mixin/index.js')],
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
    events: [
      [],
      []
    ],
    finish: [false, false],
    swipers: [],
    banner: {},
    isIpx: app.globalData.isIpx,
    activity: {
      latest: {
        offset: 0,
        limit: 10,
        data: [],
        finish: false,
      },
      expired: {
        offset: 0,
        limit: 10,
        data: [],
        finish: false,
      }
    }
  },
  onLoad() {
    wx.hideTabBar({})
    this.getData()
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
        banner: {},
      })
      this.getBanner()
      this.getEventsData(0)
      this.getEventsData(1)
      wx.stopPullDownRefresh()
    } else if (this.data.tabIndex === 2) {
      this.setData({
        activity: {
          latest: {
            offset: 0,
            limit: 10,
            data: [],
            finish: false,
          },
          expired: {
            offset: 0,
            limit: 10,
            data: [],
            finish: false,
          }
        },
      })
      this.getLatestActivity()
      this.getExpiredActivity()
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

  // 广场页banner详情
  goBannerDetail() {
    if (!(this.data.banner.target && this.data.banner.target.id)) return
    if (this.data.banner.target_type === 'circles') {
      wx.navigateTo({
        url: `/pages/topic-detail/index?id=${this.data.banner.target.id}&type=Circle`
      })
    }
    if (this.data.banner.target_type === 'subject') {
      wx.navigateTo({
        url: `/pages/topic-detail/index?id=${this.data.banner.target.id}&type=Subject`
      })
    }
  },

  // 推荐页轮播详情
  goSwiperDetail(e) {
    const index = e.currentTarget.dataset.index
    if (!(this.data.swipers[index].target && this.data.swipers[index].target.id)) return
    if (this.data.swipers[index].target_type === 'circles') {
      wx.navigateTo({
        url: `/pages/topic-detail/index?id=${this.data.swipers[index].target.id}&type=Circle`
      })
    }
    if (this.data.swipers[index].target_type === 'subject') {
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
      activity: {
        latest: {
          offset: 0,
          limit: 10,
          data: [],
          finish: false,
        },
        expired: {
          offset: 0,
          limit: 10,
          data: [],
          finish: false,
        }
      }
    })
    this.getCircleData()
    this.getTopicData()
    this.getEventsData(0)
    this.getEventsData(1)
    this.getSwiper()
    this.getBanner()
    this.getLatestActivity()
    this.getExpiredActivity()
  },

  getLatestActivity() {
    const { offset, limit } = this.data.activity.latest
    api.getActivities({ offset, limit, expired: 0 }).then(res => {
      const data = [...this.data.activity.latest.data, ...res.data]
      const finish = res.paging.total <= this.data.activity.latest.data.length
      this.setData({
        ['activity.latest.data']: data,
        ['activity.latest.finish']: finish
      })
    })
  },

  getExpiredActivity() {
    const { offset, limit } = this.data.activity.expired
    api.getActivities({ offset, limit, expired: 1 }).then(res => {
      const data = [...this.data.activity.expired.data, ...res.data]
      const finish = res.paging.total <= this.data.activity.expired.data.length
      this.setData({
        ['activity.expired.data']: data,
        ['activity.expired.finish']: finish
      })
    })
  },

  getSwiper() {
    api.homeSwiper().then(res => {
      this.setData({
        swipers: res.data
      })
    })
  },

  getBanner() {
    api.exploreSwiper().then(res => {
      this.setData({
        banner: res
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
    const page = this.data.events[index].length
    const param = {
      offset: this.data.events[index].length * 10,
      sort: index === 0 ? 'hot' : ''
    }
    api.getEvents(param).then(res => {
      const events = res.data
      const finish = res.paging.total <= (parseInt(res.paging.offset) + res.data.length)
      this.setData({
        [`events[${index}][${page}]`]: events,
        [`finish[${index}]`]: finish,
      })
    })
  },
});
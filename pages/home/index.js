const api = require('../../api/index.js')
const app = getApp()
const HOME_TAB = {
  RECOMMEND: 0,
  PLAY_GROUND: 1,
  ACTIVITY: 2
}

Page({
  mixins: [
    require('../../mixins/gift-mixin/index.js'),
    require('../../mixins/stick-btn-mixin/index.js')
  ],
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
    groundBanner: {},
    activityBanner: {},
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
      },
      my: {
        offset: 0,
        limit: 10,
        data: [],
        finish: false,
      }
    },
    showGuid: false,
    guidItem: {}
  },
  onLoad(options) {
    wx.hideTabBar({})
    options.tab != undefined && this.setData({ tabIndex: options.tab })
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
    if (this.data.tabIndex === HOME_TAB.RECOMMEND) {
      this.setData({
        circles: [],
        topics: [],
        swipers: [],
      })
      this.getCircleData()
      this.getTopicData()
      this.getSwiper()
      wx.stopPullDownRefresh()
    } else if (this.data.tabIndex === HOME_TAB.PLAY_GROUND) {
      this.setData({
        events: [[], []],
        finish: [false, false],
        groundBanner: {},
      })
      this.getGroundBanner()
      this.getEventsData(0)
      this.getEventsData(1)
      wx.stopPullDownRefresh()
    } else if (this.data.tabIndex === HOME_TAB.ACTIVITY) {
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
          },
          my: {
            offset: 0,
            limit: 10,
            data: [],
            finish: false,
          }
        },
        activityBanner: {}
      })
      this.getLatestActivity()
      this.getExpiredActivity()
      this.getMyActivity()
      this.getActivityBanner()
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
    } else if (this.data.tabIndex === 2) {
      if (this.data.activityTabIndex === 0) {
        this.getLatestActivity()
      } else if (this.data.activityTabIndex === 1) {
        this.getExpiredActivity()
      } else {
        this.getMyActivity()
      }
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

  goDetail(item) {
    if (!(item.target && item.target.id)) return

    const type = item.target_type === 'circles' ? 'Circle' : 'Subject'

    if (['circles', 'subject'].includes(item.target_type)) {
      wx.navigateTo({
        url: `/pages/topic-detail/index?id=${item.target.id}&type=${type}`
      })
      return
    }
    if (item.target_type === 'activity') {
      wx.navigateTo({
        url: `/pages/activity/index?id=${item.target.id}`
      })
      return
    }
  },

  /**
   * 弹窗跳转详情
   */
  goGuidDetail() {
    this.goDetail(this.data.guidItem)
  },

  // 广场页banner详情
  goGroundBannerDetail() {
    this.goDetail(this.data.groundBanner)
  },

  // 活动页banner详情
  goActivityBannerDetail() {
    this.goDetail(this.data.activityBanner)
  },

  // 推荐页轮播详情
  goSwiperDetail(e) {
    const index = e.currentTarget.dataset.index

    this.goDetail(this.data.swipers[index])
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
        },
        my: {
          offset: 0,
          limit: 10,
          data: [],
          finish: false,
        }
      }
    })
    this.showGuid()
    this.getCircleData()
    this.getTopicData()
    this.getEventsData(0)
    this.getEventsData(1)
    this.getSwiper()
    this.getGroundBanner()
    this.getActivityBanner()
    this.getLatestActivity()
    this.getExpiredActivity()
    this.getMyActivity()
  },

  getLatestActivity() {
    if (this.data.activity.expired.finish) return
    const { offset, limit } = this.data.activity.latest
    api.getActivities({ offset, limit, expired: 0 }).then(res => {
      const data = [...this.data.activity.latest.data, ...res.data]
      const finish = res.paging.total <= data.length
      this.setData({
        ['activity.latest.offset']: data.length,
        ['activity.latest.data']: data,
        ['activity.latest.finish']: finish
      })
    })
  },

  getExpiredActivity() {
    if (this.data.activity.expired.finish) return
    const { offset, limit } = this.data.activity.expired
    api.getActivities({ offset, limit, expired: 1 }).then(res => {
      const data = [...this.data.activity.expired.data, ...res.data]
      const finish = res.paging.total <= data.length
      this.setData({
        ['activity.expired.offset']: data.length,
        ['activity.expired.data']: data,
        ['activity.expired.finish']: finish
      })
    })
  },

  getMyActivity() {
    if (this.data.activity.my.finish) return
    const { offset, limit } = this.data.activity.my
    api.getMyActivities({ offset, limit }).then(res => {
      const data = [...this.data.activity.my.data, ...res.data]
      const finish = res.paging.total <= data.length
      this.setData({
        ['activity.my.offset']: data.length,
        ['activity.my.data']: data,
        ['activity.my.finish']: finish
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

  getGroundBanner() {
    api.exploreSwiper().then(res => {
      this.setData({
        groundBanner: res
      })
    })
  },

  getActivityBanner() {
    api.activityBanner().then(res => {
      this.setData({
        activityBanner: res
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
    api.searchSubject({ limit: 16 }).then(res => {
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

  /**
   * 弹窗（一天一次）86400000 
   */
  showGuid() {
    const oneDay = 86400000
    const nowTime = Date.parse(new Date())
    let expiredTime = wx.getStorageSync('guid_expired_time')
    const setState = (item) => {
      const itemExist = item && item.target && item.target.id
      if (itemExist) {
        this.setData({
          showGuid: true,
          guidItem: item
        }) 
      }
      return itemExist
    }
    const setStorage = () => {
      expiredTime = nowTime + oneDay
      wx.setStorageSync('guid_expired_time', expiredTime)
    }

    // 有效期内不显示
    if (expiredTime && expiredTime - nowTime > 0) return

    api.homeModal({}).then(res => {
      return setState(res)
    }).then((itemExist) => {
      // 弹窗无数据，不刷新过期时间，下次进入会再次请求弹窗接口数据
      if (!itemExist) return
      setStorage()
    })
  },

  closeGuid() {
    this.setData({
      showGuid: false
    })
  },
});
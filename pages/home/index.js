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
    },
    onLoad: function () {
      api.getEvents().then(res => {
        console.log(res, 9999)
      })

      this.getCircleData()
    },
    onReady() {
      const tabbar = this.getTabBar()
      tabbar.setData({
        selected: 0
      })
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
     * 获取推荐页圈子数据
     */
    getCircleData() {
      api.getCircles({ limit: 5 }).then(response => {
        const res = response.data
        if (res.error) {
          wx.showToast({
            title: res.error.message,
            icon: 'none',
          })
          return
        }
        const circles = res.data

        this.setData({
          circles,
        })
      })
    }
});
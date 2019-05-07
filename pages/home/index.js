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
    },
    onLoad: function () {
      
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
    }
});
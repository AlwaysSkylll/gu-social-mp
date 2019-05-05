Page({
    data: {
      mainTabs: [
        "推荐",
        "广场",
        "活动"
      ],
      middleTabs: [
        ["圈子"],
        ["热门", "最新"],
        ["最新", "往期", "我的"]
      ],
      tabIndex: 0,
      middleTabIndex: 0,
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
    middleTabHandler(e) {
      const middleTabIndex = e.detail.tabIndex
      this.setData({
        middleTabIndex
      })
    }
});
Page({
    data: {
      tabs: [
        "罍小说",
        "我的消息",
        "个人中心"
      ],
      tabIndex: 0,
    },
    onLoad: function () {
    },
    onReady() {
      const tabbar = this.getTabBar()
      tabbar.setData({
        selected: 1,
      })
      // wx.navigateTo({
      //   url: '/pages/index/index',
      //   success: () => {
      //     tabbar.setData({ showBar: false })
      //   }
      // })
    },
    myTabHandler(e) {
      const tabIndex = e.detail.tabIndex
      this.setData({
        tabIndex
      })
    }
});

Page({
    data: {
      tabs: [
        "小说",
        "我的消息",
        "个人中心"
      ]
    },
    onLoad: function () {
      
    },
    onReady() {
      const tabbar = this.getTabBar()
      tabbar.setData({
        selected: 1
      })
    },
    myTabHandler(e) {
      const tabIndex = e.detail.tabIndex
      console.log(tabIndex, 999999)
    }
});

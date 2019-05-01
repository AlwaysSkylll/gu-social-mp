Page({
    data: {},
    onLoad: function () {
      
    },
    onReady() {
      const tabbar = this.getTabBar()
      tabbar.setData({
        selected: 0
      })
    }
});
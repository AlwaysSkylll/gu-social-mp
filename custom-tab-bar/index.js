Component({
  data: {
    selected: 0,
    color: "#000000",
    selectedColor: "#5cd4ea",
    list: [{
      pagePath: "/pages/home/index",
      iconPath: "/static/home.png",
      selectedIconPath: "/static/home_active.png",
      text: "首页"
    }, {
      pagePath: "/pages/my/index",
      iconPath: "/static/my.png",
      selectedIconPath: "/static/my_active.png",
      text: "我的"
    }],
    showTabList: [
      'pages/home/index',
      'pages/my/index',
    ],
    showBar: true,
  },
  attached() {
    // const pageList = getCurrentPages()
    // const pageLength = pageList.length
    // const page = pageList[pageLength - 1]
    // this.setData({
    //   showBar: page && this.data.showTabList.indexOf(page.route) != -1 || false
    // })
    // wx.showToast({
    //   title: String(pageLength) + 'attached',
    // })
  },
  ready() {
    const pageList = getCurrentPages()
    const pageLength = pageList.length
    const page = pageList[pageLength - 1]
    this.setData({
      showBar: page && this.data.showTabList.indexOf(page.route) != -1 || false
    })
  },
  methods: {
    switchTab(e) {
      const tabIndex = this.getTabBar().data.selected
      const data = e.currentTarget.dataset
      const url = data.path
      if (data.index === this.data.selected) {
        return;
      }
      wx.switchTab({ url })
    }
  }
})
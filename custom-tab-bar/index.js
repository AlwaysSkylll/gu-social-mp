const app = getApp()

Component({
  /**
  * 组件的属性列表
  */
  properties: {
    selected: {
      type: Number,
      value: 0
    }
  },
  data: {
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
    publishModalShow: false,
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
      this.hidePublishHandler()
      const data = e.currentTarget.dataset
      const url = data.path
      if (data.index === this.data.selected) {
        return;
      }
      wx.switchTab({ url })
    },
    /**
    * 展示发布按钮
    */
    showPublishHandler() {
      this.setData({
        publishModalShow: true
      })
    },
    /**
     * 隐藏发布按钮
     */
    hidePublishHandler() {
      this.setData({
        publishModalShow: false
      })
    },
    /**
     * 前往发布页面
     */
    goPublishPage(e) {
      const type = e.currentTarget.dataset.type
      // 角色不是kol不能发布话题
      if (app.globalData.userInfo.role !== 'kol' && type === 'topic') {
        wx.showToast({
          icon: 'none',
          title: '缺少权限',
        })
        return
      }
      wx.navigateTo({
        url: `/pages/publish-${type}/index`,
      })
    }
  },
 
})
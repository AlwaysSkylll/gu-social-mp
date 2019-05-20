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
    touchStartTime: 0,
    userInfo: {},
  },
  attached() {
  },
  ready() {
    const pageList = getCurrentPages()
    const pageLength = pageList.length
    const page = pageList[pageLength - 1]
    const userInfo = wx.getStorageSync('userInfo')
    this.setData({
      userInfo,
      showBar: page && this.data.showTabList.indexOf(page.route) != -1 || false
    })
  },
  methods: {
    switchTab(e) {
      this.hidePublishHandler()
      const data = e.currentTarget.dataset
      const url = data.path
      if (data.index == this.data.selected) {
        console.log(e.timeStamp, this.data.touchStartTime)
        if (e.timeStamp - this.data.touchStartTime < 400) {
          // 双击，进入
          this.doubleTouchTab()
        }
        this.setData({
          touchStartTime: e.timeStamp
        })
        return;
      }
      wx.switchTab({ url })
    },

    doubleTouchTab() {
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 0
      })
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
      if (this.data.userInfo.role !== 'kol' && type === 'topic') {
        wx.showToast({
          icon: 'none',
          title: '成为KOL才可以发布',
        })
        return
      }
      wx.navigateTo({
        url: `/pages/publish-${type}/index`,
      })
    }
  },
 
})
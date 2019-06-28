// stick-button/index.js
const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    scrollDown: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showHomeBtn: false,
    isIpx: false
  },

  attached() {
    this.setData({
      isIpx: app.globalData.isIpx
    })
    const pages = getCurrentPages()
    const showList = [
      'pages/home/index',
      'pages/index/index',
      'pages/my/index',
    ]
    console.log('123', pages, pages.length === 1, showList.indexOf(pages[0].route) === -1)

    if (pages.length === 1 && showList.indexOf(pages[0].route) === -1) {
      this.setData({
        showHomeBtn: true
      })
    } else {
      this.setData({
        showHomeBtn: false
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goHome() {
      wx.switchTab({
        url: '/pages/home/index'
      })
    }
  }
})

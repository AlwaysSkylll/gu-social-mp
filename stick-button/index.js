// stick-button/index.js

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    showHomeBtn: false
  },

  attached() {
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

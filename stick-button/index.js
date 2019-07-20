// stick-button/index.js
const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    scrollDown: {
      type: Boolean,
      value: false,
      observer: function (value) { 
        if (!value) {
          console.log(this, this.animationHome)
          this.animationHome.translateX(0).step()
          this.animationIcon.translate(0, 0).step()
          this.setData({
            animationHome: this.animationHome.export(),
            animationIcon: this.animationIcon.export()
          })
          return
        }
        this.animationHome.translateX(100).step()
        this.animationIcon.translate(100, -72).step()

        this.setData({
          animationHome: this.animationHome.export(),
          animationIcon: this.animationIcon.export()
        })
        return
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    showHomeBtn: false,
    isIpx: false,
    animationHome: {},
    animationIcon: {},
  },

  attached() {
    // 动画实例
    this.animationHome = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    this.animationIcon = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    this.animationIcon.rotate(45).step({ timingFunction: 'step-start', 'transform-origin': 'right' })


    this.setData({
      isIpx: app.globalData.isIpx,
      animationIcon: this.animationIcon.export()
    })
    const pages = getCurrentPages()
    const showList = [
      'pages/home/index',
      'pages/index/index',
      'pages/my/index',
    ]

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

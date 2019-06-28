const { throtting } = require('../../utils/util.js')

module.exports = {
  data: {
    lastScrollTop: 0,
    scrollDown: false
  },
  // 页面滚动监听
  onPageScroll(e) {
    const scrollDown = e.scrollTop - this.data.lastScrollTop > 0

    // 节流改变数据
    throtting(() => {
      this.setData({
        lastScrollTop: e.scrollTop
      })
      console.log('change', 222)
    })

    if (scrollDown === this.data.scrollDown) return

    this.setData({ scrollDown })
  },
}
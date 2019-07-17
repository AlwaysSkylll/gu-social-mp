module.exports = {
  data: {
    popover: null,
  },
  // 显示赠送礼物元素
  sendGift(e) {
    console.log('显示赠送礼物元素', e.detail)
    if (!this.data.popover) {
      this.setData({ popover: this.selectComponent('#popover') })
    }
    const giftId = e.detail.giftId
    const popoverRes = e.detail.popoverRes
    this.data.popover.onDisplay(popoverRes);
  }
}
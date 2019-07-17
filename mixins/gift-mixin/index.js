const api = require('../../api/index.js')

module.exports = {
  data: {
    popover: null,
    giftList: [],
    _giftId: undefined,
    _giftEventId: undefined,
  },
  getData() {
    this.getGiftList()
  },
  // 显示赠送礼物元素
  showGiftList(e) {
    console.log('显示赠送礼物元素', e.detail)
    if (!this.data.popover) {
      this.setData({ popover: this.selectComponent('#popover') })
    }
    const _giftEventId = e.detail.eventId;
    this.setData({ _giftEventId });
    const popoverRes = e.detail.popoverRes;
    this.data.popover.onDisplay(popoverRes);
  },
  // 获取礼物列表
  getGiftList() {
    api.getGiftList().then(res => {
      this.setData({ giftList: res.data })
    })
  },
  // 赠送礼物
  sendGift(e) {
    const _giftId = e.currentTarget.dataset.id;
    const _giftEventId = this.data._giftEventId;
    this.setData({ _giftId })
    console.log('礼物被点击啦', e, _giftId);

    api.sendGift({}, _giftEventId, _giftId).then(res => {      
      wx.showToast({
        title: '礼物发送成功'
      })
      this.data.popover.onHide()
    });
  }
}
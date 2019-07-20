const api = require('../../api/index.js')

module.exports = {
  data: {
    popover: null,
    giftList: [],
    _giftId: undefined,
    _giftEventIndex: undefined,
    _giftEventId: undefined,
  },
  getData() {
    if (this.data.giftList.length) return
    this.getGiftList()
  },

  onPullDownRefresh() {
    this.getGiftList()
  },

  // 显示赠送礼物元素
  showGiftList(e) {
    console.log('显示赠送礼物元素', e.detail)
    if (!this.data.popover) {
      this.setData({ popover: this.selectComponent('#popover') })
    }
    const _giftEventId = e.detail.eventId
    const _giftEventIndex = e.detail.eventIndex
    const _eventArray = e.detail.eventArray
    const popoverRes = e.detail.popoverRes

    this.setData({ _giftEventId, _giftEventIndex, _eventArray })
    this.data.popover.onDisplay(popoverRes)
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

    api.sendGift({}, _giftEventId, _giftId).then(res => {      
      wx.showToast({
        title: '礼物发送成功'
      })
      this.data.popover.onHide()

      this.computedGiftNum()
    });
  },

  /**
   * 动态刷新当前说说卡片的礼物数量 + 1
   * @return {[type]} [description]
   */
  computedGiftNum() {
    /* 多层嵌套arrayName 需要解析 (外部传入arrayName时就可以先用’，‘ 分割嵌套层级) */
    const result = this.data._eventArray.split(',')

    let events = {}                                 // 当前页面包含说说的对象本体
    let eventIndex = this.data._giftEventIndex     // 当前说说对象在当前页面的列表里的下标
    let eventArrayName = this.data._eventArray    // setData 时当前页面包含说说对象的外层数组
    let giftNum = 0

    /* 多层嵌套 */
    if (result.length > 1) {
      eventArrayName = result[0]                 // [][].. 之前的变量名
      events = this.data[`${eventArrayName}`]

      for (let i = 1; i < result.length; i++) {
        events = events[result[i]]
        eventArrayName += `[${result[i]}]`
      }

      giftNum = events[`${eventIndex}`].gift_num
    } else {
    /* 非多层嵌套 */
      events = this.data[`${eventArrayName}`]
    }

    /* 外层是数组 */
    if (events.length) {
      giftNum = result.length > 1 ? giftNum : this.data[`${eventArrayName}`][`${eventIndex}`].gift_num
      this.setData({
        [`${eventArrayName}[${eventIndex}].gift_num`]: ++giftNum
      })
      return
    }

    /* 外层是对象 */
    if (Object.prototype.toString.call(this.data[`${eventArrayName}`]) === '[object Object]') {
      giftNum = this.data[`${eventArrayName}`].gift_num

      this.setData({
        [`${eventArrayName}.gift_num`]: ++giftNum
      })
      return
    }
  }
}
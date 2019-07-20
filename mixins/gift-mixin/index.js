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

      const testRegx = /^[a-zA-Z]+/
      const testNum = /\d/g
      const result = testRegx.exec(this.data._eventArray)


      let events = {}
      let eventIndex = this.data._giftEventIndex
      let eventArrayName = ''
      // 多层嵌套arrayName 需要解析 (首页变态数据结构。解决方案二，外部传入arrayName时就可以先用’，‘ 分割嵌套层级，这样会简单很多哦！)
      if (result && this.data._eventArray.includes('[')) {
        const partName1 = result[0] // [][].. 之前的变量名
        const partName2 = this.data._eventArray.slice(partName1.length) // 包含 [][] 字符串
        let events = this.data[`${partName1}`]
        let temp = ''
        let giftNum = 0
        let dataName = partName1

        while (temp = testNum.exec(partName2)) {
          events = events[temp[0]]
          dataName += `[${temp[0]}]`
        }

        giftNum = events[`${eventIndex}`].gift_num

        this.setData({
          [`${dataName}[${eventIndex}].gift_num`]: ++giftNum
        })
      } else {
        events = this.data[`${this.data._eventArray}`]
        eventArrayName = this.data._eventArray

        if (events.length) {
          let giftNum = this.data[`${eventArrayName}`][`${eventIndex}`].gift_num
          console.log(this.data[`${eventArrayName}`], 9999)

          this.setData({
            [`${eventArrayName}[${eventIndex}].gift_num`]: ++giftNum
          })
          return
        }

        if (eventIndex == 0) {
          let giftNum = this.data[`${eventArrayName}`].gift_num
          console.log(this.data[`${eventArrayName}`], 9999)

          this.setData({
            [`${eventArrayName}.gift_num`]: ++giftNum
          })
        }
      }
    });
  }
}
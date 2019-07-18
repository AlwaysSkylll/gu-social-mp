const { dateTimeDown } = require('../../../utils/time-toolkit.js')
const { uuid } = require('../../../utils/util.js')
const app = getApp()

// pages/components/activity-card/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    objection: {
      type: Boolean,
      value: false
    },
    item: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    _timeText: '',
    _status: 0,
    _statusList: {
      ready: 0,
      going: 1,
      end: 2,
    },
    uuid: '',
  },

  attached() {
    this.setData({
      uuid: uuid()
    })
    app.addIntervalEvent(this.timeCreator, this, this.data.uuid)
  },

  detached() {
    app.removeIntervalEvent(this.data.uuid)
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goDetail() {
      if (this.data._status == 0) {
        wx.showToast({
          title: '活动未开始',
          icon: 'none'
        })
        return
      }
      wx.navigateTo({
        url: `/pages/activity/index?id=${this.properties.item.id}`,
      })
    },

    timeCreator() {
      const startTime = new Date(this.properties.item.start_time)
      const endTime = new Date(this.properties.item.end_time)
      const nowTime = new Date()
      let prefix = ''
      let _status = this.data._status
      let _timeText = '活动已结束'

      if (nowTime - endTime >= 0) {
        _status = this.data._statusList.end
        this.setData({ _status, _timeText })
        app.removeIntervalEvent(this.data.uuid)
        return
      }

      if (startTime - nowTime > 0) {
        prefix = '活动即将开始 距开始 '
        _status = this.data._statusList.ready
        _timeText = prefix + dateTimeDown(startTime)
        this.setData({ _status, _timeText })
        console.log(_timeText, 'from card')
        return
      }

      if (endTime - nowTime > 0) {
        prefix = '活动正在进行 距结束 '
        _status = this.data._statusList.going
        _timeText = prefix + dateTimeDown(endTime)
        this.setData({ _status, _timeText })
        console.log(_timeText, 'from card')
        return
      }
    },

    quickPublish() {
      if (this._status == 0) return
      wx.navigateTo({
        url: `/pages/publish-event/index?title=${this.data.item.title}&id=${this.data.item.id}&type=Activity`,
      })
    },
  }
})

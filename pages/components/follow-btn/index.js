// pages/components/follow-btn/index.js
const api = require('../../../api/index.js')

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    text: {
      type: String,
      value: ''
    },
    userId: {
      type: String,
      value: ''
    },
    disabled: {
      type: Boolean,
      value: false
    },
    event: {
      type: Object,
      value: null
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    followHandler() {
      console.log(this.properties)
      const id = this.data.userId
      // 取关
      if (this.data.disabled) {
        api.unfollow({}, id).then(res => {
          if (res.success) {
            this.setEvent(false)
            wx.showToast({
              icon: "none",
              title: '取消关注'
            })
          }
        })
        return
      }
      // 关注
      api.follow({}, id).then(res => {
        if (res.success) {
          this.setEvent(true)
          wx.showToast({
            title: '关注成功'
          })
        }
      })
    },
    setEvent(status) {
      this.triggerEvent('followstatus', status)
    }
  },
})

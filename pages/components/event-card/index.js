// pages/components/event-card/index.js
const api = require('../../../api/index.js')

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    event: {
      type: Object,
      value: null
    },
    type: {
      type: String,
      value: ''
    },
    callback: {
      type: Boolean,
      value: true
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    user: wx.getStorageSync('userInfo'),
    hovered: false,
  },

  attached() {
    this.setData({
      user: wx.getStorageSync('userInfo'),
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toDetail() {
      if (!this.data.callback) return
      let id = 0;
      if (this.properties.event) {
        id = this.properties.event.id
      }
      wx.navigateTo({
        url: `/pages/event-detail/index?id=${id}`,
      })
    },
    imgLoadError(e) {
      // const index = e.currentTarget.dataset.index
      // this.setData({
      //   [`event.images[${index}]`]: '/static/default_ground.jpg'
      // })
    },
    setFollow(e) {
      const status = e.detail
      if (this.data.event.user.follow == status) return
      this.setData({
        ['event.user.follow']: status
      })
    },
    shareEvent() {
      this.triggerEvent('shareEvent', this.data.event)
    },
    setPraise() {
      const status = !this.data.event.praise
      let praise_num = this.data.event.praise_num || 0
      const callback = (praiseNum) => {
        this.setData({
          ['event.praise']: status,
          ['event.praise_num']: praise_num < 0 ? 0 : praise_num
        })
      }
      const param = {
        target_type: 'event',
        target_id: this.data.event.id,
      }
      if (status) {
        api.praise(param).then(res => {
          callback(praise_num++)
        })
      } else {
        api.unpraise(param).then(res => {
          callback(praise_num--)
        })
      }
    },
    /**
    * 预览图片
    */
    preview(e) {
      const index = e.currentTarget.dataset.index
      const imgLink = this.data.event.images[index]
      if (!imgLink) {
        return;
      }
      wx.previewImage({
        current: imgLink,
        urls: this.data.event.images
      })
    },

    setHoverStatus(status) {
      if (this.data.hovered === status) return
      this.setData({
        hovered: status
      })
    },

    hoverCard() {
      this.setHoverStatus(true)
    },
    unHoverCard() {
      this.setHoverStatus(false)
    },
    /**
     * 前往主题详情
     */
    goSubjectDetail() {
      const id = this.data.event.subject && this.data.event.subject.id
      const type = 'Subject'
      if (!id) return
      wx.navigateTo({
        url: `/pages/topic-detail/index?id=${id}&type=${type}`,
      })
    }
   }
})

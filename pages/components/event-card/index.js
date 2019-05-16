// pages/components/event-card/index.js
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
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  attached() {

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
    }
  }
})

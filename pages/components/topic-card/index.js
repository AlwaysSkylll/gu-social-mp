// pages/components/topic-card/index.js
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
    toDetail() {
      let id = 0;
      if (this.properties.event) {
        id = this.properties.event.id
      }
      wx.navigateTo({
        url: `/pages/topic-detail/index?id=${id}&type=${this.data.type}`,
      })
    }
  }
})

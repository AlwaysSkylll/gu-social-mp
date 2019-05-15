// pages/components/mini-topic-card/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      value: []
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
      // wx.navigateTo({
      //   url: `/pages/topic-detail/index?id=${this.data.item.id}&type=subjects`,
      // })
    }
  }
})

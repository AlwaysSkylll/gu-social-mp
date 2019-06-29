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

  },

  /**
   * 组件的方法列表
   */
  methods: {
    goDetail() {
      wx.navigateTo({
        url: `/pages/activity/index?id=${this.properties.item.id}`,
      })
    }
  }
})

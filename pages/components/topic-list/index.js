// pages/components/topic-list/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    topics: {
      type: Array,
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
    selectItem(e) {
      const index = e.currentTarget.dataset.index
      this.triggerEvent('selecttopic', this.data.topics[index])
    }
  }
})

// pages/component/scroll-tab/index.js
Component({
  options: {
    addGlobalClass: true,
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },

  /**
   * 组件的属性列表
   */
  properties: {
    tabItems: {
      type: Array,
      value: [],
    },
    scrollHeight: {
      type: Number,
      value: 390,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentTabIndex: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 切换标签
    switchTab(e) {
      let index = this.data.currentTabIndex
      if (e.type === 'tap') {
        index = e.currentTarget.dataset.index
      } else if (e.type === 'change') {
        index = e.detail.current
      }
      if (this.data.currentTabIndex === index) {
        return false
      }
      this.triggerEvent('switch', { index, name: this.data.tabItems[index].slotName }, {})
      this.setData({
        currentTabIndex: index,
      })
    },
    // 滚动到底部
    scrolltolower() {
      const index = this.data.currentTabIndex
      this.triggerEvent('scrolltolower', { index, name: this.data.tabItems[index].slotName }, {})
    }
  }
})

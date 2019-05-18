// pages/components/gu-tab/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabs: {
      type: Array,
      value: []
    },
    width: {
      type: String,
      value: '100%'
    },
    center: {
      type: Boolean,
      value: false
    },
    fontSize: {
      type: Number,
      value: 16
    },
    initialIndex: {
      type: Number,
      value: 0
    },
    inlineBlock: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    selected: 0,
  },

  ready() {
    this.setData({
      selected: this.properties.initialIndex
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    selectTab(e) {
      const tabIndex = e.currentTarget.dataset.index
      this.setData({
        selected: tabIndex
      })
      this.triggerEvent('selectmytab', {
        tabIndex
      })
    }
  }
})

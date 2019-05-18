// custom-simple-bar/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    subject: {
      type: Object,
      value: {}
    },
    type: {
      type: String,
      value: ''
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    publishModalShow: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
    * 展示发布按钮
    */
    showPublishHandler() {
      this.setData({
        publishModalShow: true
      })
    },
    /**
     * 隐藏发布按钮
     */
    hidePublishHandler() {
      this.setData({
        publishModalShow: false
      })
    },
    /**
     * 前往发布页面
     */
    goPublishPage(e) {
      const type = e.currentTarget.dataset.type
      const eventType = this.data.type

      // 角色不是kol不能发布话题
      const userInfo = wx.getStorageSync('userInfo')
      if (userInfo.role !== 'kol' && type === 'topic') {
        wx.showToast({
          icon: 'none',
          title: '缺少权限',
        })
        return
      }
      let param = ''
      param = `subjectTitle=${this.data.subject.title}&subjectId=${this.data.subject.id}&type=${eventType}`
      wx.navigateTo({
        url: `/pages/publish-event/index?${param}`,
      })
    },
  }
})

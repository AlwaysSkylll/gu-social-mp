const api = require('../../api/index.js')

Page({
    data: {
      tabs: [
        "罍小说",
        "我的消息",
        "个人中心"
      ],
      tabIndex: 0,
      myEvents: [],
      limit: 10,
      finish: false,
      userInfo: {},
    },
    onLoad: function () {
      this.getData()
    },
    onReady() {
      const tabbar = this.getTabBar()
      tabbar.setData({
        selected: 1,
      })
      // wx.navigateTo({
      //   url: '/pages/index/index',
      //   success: () => {
      //     tabbar.setData({ showBar: false })
      //   }
      // })
    },
    myTabHandler(e) {
      const tabIndex = e.detail.tabIndex
      this.setData({
        tabIndex
      })
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
      this.setData({
        offset: 0,
        myEvents: [],
        finish: false,
      })
      this.getData();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
      this.getData();
    },

    getData() {
      this.getMyEvents()
      this.getUserInfo()
    },

    /**
     * 获取我的说说
     */
    getMyEvents() {
      if (this.data.finish) {
        return
      }
      const param = {
        offset: this.data.myEvents.length,
        limit: this.data.limit,
      }
      api.myEvents(param).then(res => {
        const myEvents = [...this.data.myEvents, ...res.data]
        const finish = res.paging.total <= myEvents.length

        this.setData({
          myEvents,
          finish
        })
      })
    },

    /**
     * 获取用户信息
     */
    getUserInfo() {
      api.getUserInfo({}).then(res => {
        const userInfo = res

        this.setData({
          userInfo,
        })
      })
    },
});

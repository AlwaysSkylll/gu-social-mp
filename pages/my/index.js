const api = require('../../api/index.js')
const app = getApp()

Page({
  mixins: [require('../../mixins/stick-btn-mixin/index.js')],
  data: {
    tabs: [
      "罍小说",
      "我的消息",
      "个人中心"
    ],
    profileList: [
      {
        name: '我的关注',
        path: '/pages/my/follow/index'
      }, {
        name: '个人信息',
        path: '/pages/my/info/index'
      }, 
      // {
      //   name: '标签管理',
      //   path: '/pages/my/tag/index'
      // }, 
      {
        name: '活动管理',
        path: '/pages/my/activity/index'
      },
      {
        name: '礼物管理',
        path: '/pages/my/gift/index'
      },
      {
        name: '兑换中心',
        path: '/pages/my/exchange/index'
      },
      {
        name: '邀请好友',
        path: '/pages/my/invite/index'
      }
    ],
    messageList: [
      {
        name: '系统消息',
        empty: '美好的一天从评论开始',
        path: '',
        icon: '/static/system_msg.png',
        badge: 0
      }, {
        name: '评论消息',
        path: '',
        empty: '暂无关于评论消息',
        icon: '/static/comment_msg.png',
        badge: 0
      }, {
        name: '点赞消息',
        empty: '暂无关于点赞消息',
        path: '',
        icon: '/static/thumbs_msg.png',
        badge: 0
      }, {
        name: '送礼消息',
        empty: '暂无关于送礼消息',
        path: '',
        icon: '/static/gift_msg.png',
        badge: 0
      }, {
        name: '活动消息',
        empty: '最新活动消息已上线',
        path: '',
        icon: '/static/activity_msg.png',
        badge: 0
      }
    ],
    tabIndex: 0,
    myEvents: [],
    offset: 0,
    limit: 10,
    finish: false,
    userInfo: {},
    isIpx: app.globalData.isIpx
  },
  onLoad: function () {
    this.getData()
  },
  onReady() {
    wx.hideTabBar({})
  },
  onShow() {
    wx.hideTabBar({})

    if (app.globalData.needRefresh === true) {
      app.globalData.needRefresh = false
      this.getData()
    }
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
    this.getData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.tabIndex !== 0) return
    this.getMyEvents()
  },

  getData() {
    this.setData({
      finish: false,
      offset: 0,
      myEvents: []
    })
    this.getMyEvents()
    this.getUserInfo()
    wx.stopPullDownRefresh();
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
  
  /**
   * 上传图片
   */
  uploadImg(e) {
    const self = this

    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (e) => {
        console.log(e, 'success')
        const toBase64Images = 'data:image/jpeg;base64,' + wx.getFileSystemManager().readFileSync(e.tempFilePaths[0], 'base64')
        api.uploadImage({ image: toBase64Images }).then(({url}) => {
          console.log(url, 'uploadImage')
          api.setUserInfo({
            background: url
          }).then(res => {
            this.setData({
              ['userInfo.background']: url
            })
            console.log(res, 'modified userinfo')
          })
        })
      },
      fail: (e) => {
        console.log(e, 'fail')
      }
    })
  },
  /**
   * 预览图片
   */
  preview(e) {
    const index = e.currentTarget.dataset.index
    const imgLink = this.data.topic.images[index]
    if (!imgLink) {
      return;
    }
    wx.previewImage({
      current: imgLink,
      urls: this.data.topic.images
    })
  },

  /**
   * 我的消息 所有列表跳转功能
   */
  simpleListHandler(e) {
    const path = e.currentTarget.dataset.path
    wx.navigateTo({
      url: path,
    })
  },
});

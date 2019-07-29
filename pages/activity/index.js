// pages/activity/index.js
const api = require('../../api/index.js')
const app = getApp()
const { dateTimeDown } = require('../../utils/time-toolkit.js')
const { formatTime, uuid } = require('../../utils/util.js')
const drawTools = require('../../utils/draw-tools.js')

Page({
  mixins: [
    require('../../mixins/gift-mixin/index.js'),
    require('../../mixins/stick-btn-mixin/index.js')
  ],
  /**
   * 页面的初始数据
   */
  data: {
    subject: {},
    events: [],
    id: 0,
    type: '',
    sharePaperPath: '',
    shareCardShow: false,
    shareChoiceShow: false,
    showHomeBtn: false,
    offset: 0,
    finish: false,
    tabIndex: 0,
    hotEvents: [],

    // 倒计时文案
    _timeText: '',
    _status: 0,
    _statusList: {
      ready: 0,
      going: 1,
      end: 2,
    },
    uuid: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
      type: 'Activity',
      showHomeBtn: getCurrentPages().length === 1,
      uuid: uuid()
    })
    this.getData()
  },

  previewImg() {
    const imgLink = this.data.subject.covers
    if (!imgLink.length) {
      return;
    }
    wx.previewImage({
      current: imgLink,
      urls: imgLink
    })
  },

  homePage() {
    wx.switchTab({
      url: '/pages/home/index',
    })
  },

  hideCard() {
    this.setData({
      shareCardShow: false,
    })
  },

  showCard() {
    this.setData({
      shareCardShow: true,
    })
  },

  showShareChoice() {
    this.setData({
      shareChoiceShow: true,
    })
  },

  hideShareChoice() {
    this.setData({
      shareChoiceShow: false,
    })
  },

  createCanvas() {
    this.hideShareChoice()
    if (this.data.sharePaperPath) {
      this.setData({
        'shareCardShow': true
      });
      return
    }
    wx.showLoading({
      title: '海报生成中',
    })
    const that = this
    const context = wx.createCanvasContext('mycanvas');
    const canvasHeight = drawTools.rpx2px(865)
    const canvasWidth = drawTools.rpx2px(575)
    context.setFillStyle("#ffffff")
    context.fillRect(0, 0, canvasWidth, canvasHeight)

    // 描述区域
    const descY = drawTools.rpx2px(360)
    const desc = this.data.subject.description
    context.setTextAlign('left');
    context.setFillStyle('#000000');
    context.setFontSize(drawTools.rpx2px(22));
    const descRowLen = drawTools.drawText(context, desc, drawTools.rpx2px(50), descY, canvasWidth - drawTools.rpx2px(100), 3)

    // 虚线
    context.save()
    context.setLineWidth(drawTools.rpx2px(1))
    context.setStrokeStyle('#eeeeee');
    context.setLineDash([drawTools.rpx2px(10), drawTools.rpx2px(3)], 0)
    context.beginPath()
    context.moveTo(0, drawTools.rpx2px(600))
    context.lineTo(drawTools.rpx2px(575), drawTools.rpx2px(600))
    context.stroke()
    context.restore()


    // 话题区域

    Promise.all([drawTools.imgToTempImg(this.data.subject.covers[0]), drawTools.imgToTempImg(this.data.subject.qrcode)]).then(images => {
      context.drawImage(images[0], 0, 0, drawTools.rpx2px(575), drawTools.rpx2px(320));
      context.drawImage(images[1], drawTools.rpx2px(217), drawTools.rpx2px(620), drawTools.rpx2px(140), drawTools.rpx2px(140));

      context.save()
      context.setFillStyle('#5dd4ea')
      context.beginPath()
      context.moveTo(0, 0)
      context.lineTo(0, drawTools.rpx2px(75))
      context.lineTo(drawTools.rpx2px(75), 0)
      context.lineTo(0, 0)
      context.fill()
      context.restore()

      context.save()
      context.setFillStyle('#ffffff')
      context.rotate(-45 * Math.PI / 180)
      context.translate(drawTools.rpx2px(-20), drawTools.rpx2px(60))
      context.fillText('活动', drawTools.rpx2px(0), drawTools.rpx2px(-20))
      context.restore()

      context.draw()

      setTimeout(() => {
        this.createImage('mycanvas', 'shareCardShow')
      }, 200)
    })
  },

  copyDesc() {
    wx.setClipboardData({
      data: this.data.subject.description,
      success: () => {
        wx.showToast({
          title: '已复制到剪切板',
        })
      }
    })
  },

  createImage(canvasId, canvasShowProperty) {
    wx.canvasToTempFilePath({
      canvasId: canvasId,
      success: (res) => {
        wx.hideLoading()
        let tempFilePath = res.tempFilePath;
        this.setData({
          sharePaperPath: tempFilePath,
          [canvasShowProperty]: true
        });
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },

  //点击保存到相册
  saveImage() {
    var that = this
    wx.saveImageToPhotosAlbum({
      filePath: that.data.sharePaperPath,
      success(res) {
        that.onShareAppMessage()
        wx.showModal({
          content: '图片已保存到相册，赶紧晒一下吧~',
          showCancel: false,
          confirmText: '好的',
          confirmColor: '#333',
          success: function (res) {
            if (res.confirm) {
              that.setData({
                maskHidden: false
              })
            }
          }, fail: function (res) {
          }
        })
      },
      fail: function (res) {
        if (res.errMsg === "saveImageToPhotosAlbum:fail auth deny" || res.errMsg === "saveImageToPhotosAlbum:fail:auth denied") {
          app.requestSaveImgPermission()
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.globalData.needRefresh === true) {
      app.globalData.needRefresh = false
      this.getData()
    }
    app.addIntervalEvent(this.timeCreator, this, this.data.uuid)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    app.removeIntervalEvent(this.data.uuid)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    app.removeIntervalEvent(this.data.uuid)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.tabIndex === 1)  return
    this.getData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    const parmas = {
      target_type: this.data.type.toLowerCase(),
      target_id: this.data.id,
    }
    api.share(parmas).then(() => {
      this.setData({
        ['subject.share_num']: this.data.subject.share_num + 1
      })
    });
  },

  getData() {
    if (this.data.finish) return
    const param = {
      offset: this.data.events.length,
      limit: 5
    }
    this.getEvents(param)
    this.getDetail()
    this.getHotEvents()
  },

  /**
   * 获取话题下的说说
   */
  getEvents(param) {
    api.getActivityEvents(param, this.data.id).then(res => {
      const events = [...this.data.events, ...res.data]
      const finish = res.paging.total <= events.length
      this.setData({
        events,
        finish
      })
    })
  },

  getHotEvents() {
    api.getActivityEvents({ hot: 1, limit: 10 }, this.data.id).then(res => {
      const hotEvents = res.data
      this.setData({
        hotEvents
      })
    })
  },

  /**
   * 获取话题
   */
  getDetail() {
    api.getActivityDetail({}, this.data.id).then(res => {
      this.setData({
        subject: res
      })
    })
  },

  tabHandler(e) {
    const tabIndex = e.detail.tabIndex
    this.setData({
      tabIndex
    })
  },

  // 倒计时
  timeCreator() {
    const startTime = new Date(this.data.subject.start_time.replace(/-/g, '/'))
    const endTime = new Date(this.data.subject.end_time.replace(/-/g, '/'))
    const nowTime = new Date()
    let prefix = ''
    let _status = this.data._status
    let _timeText = '活动已结束'

    if (nowTime - endTime >= 0) {
      _status = this.data._statusList.end
      this.setData({ _status, _timeText })
      app.removeIntervalEvent(this.data.uuid)
      return
    }

    if (startTime - nowTime > 0) {
      prefix = '活动即将开始 距开始 '
      _status = this.data._statusList.ready
      _timeText = prefix + dateTimeDown(startTime)
      this.setData({ _status, _timeText })
      return
    }

    if (endTime - nowTime > 0) {
      prefix = '活动正在进行 距结束 '
      _status = this.data._statusList.going
      _timeText = prefix + dateTimeDown(endTime)
      this.setData({ _status, _timeText })
      return
    }
  }
})
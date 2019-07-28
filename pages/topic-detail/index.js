// pages/topic-detail/index.js
const api = require('../../api/index.js')
const app = getApp()
const { formatTime } = require('../../utils/util.js')
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
    finish: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
      type: options.type,
      showHomeBtn: getCurrentPages().length === 1
    })
    wx.setNavigationBarTitle({
      title: options.type === 'Circle' ? '圈子' : '话题'
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
        'shareCardShow' : true
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
    const descY = this.data.type === 'Subject' ? drawTools.rpx2px(400) : drawTools.rpx2px(360)
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

      if (this.data.type === 'Subject') {
        let title = this.data.subject.title
        title = title.length < 8 ? title : title.slice(0, 8) + '...'
        context.setFontSize(drawTools.rpx2px(22))
        context.setFillStyle('#979797')
        const titleWidth = context.measureText(title + '#').width + 30
        context.save()
        context.setFillStyle('#eeeeee')
        context.fillRect(drawTools.rpx2px(30), drawTools.rpx2px(335), titleWidth, drawTools.rpx2px(36))
        context.restore()
        context.drawImage('/static/icon_huati@2x.png', drawTools.rpx2px(40), drawTools.rpx2px(340), drawTools.rpx2px(24), drawTools.rpx2px(22));
        context.fillText('#' + title, drawTools.rpx2px(70), drawTools.rpx2px(360))

        context.setStrokeStyle('#979797');
        context.beginPath()
        context.moveTo(0, drawTools.rpx2px(385))
        context.lineTo(drawTools.rpx2px(575), drawTools.rpx2px(385))
        context.stroke()

        context.save()
        context.setTextAlign('center')
        context.setFillStyle('#000000')
        context.setFontSize(drawTools.rpx2px(16))
        context.fillText(this.data.subject.comment_num, drawTools.rpx2px(530), drawTools.rpx2px(360))
        context.fillText(this.data.subject.praise_num, drawTools.rpx2px(455), drawTools.rpx2px(360))
        context.fillText(this.data.subject.participant_num, drawTools.rpx2px(375), drawTools.rpx2px(360))
        context.drawImage('/static/icon_chanyu@2x.png', drawTools.rpx2px(325), drawTools.rpx2px(345), drawTools.rpx2px(27), drawTools.rpx2px(18));
        context.drawImage('/static/icon_xihuan@2x.png', drawTools.rpx2px(410), drawTools.rpx2px(345), drawTools.rpx2px(25), drawTools.rpx2px(22));
        context.drawImage('/static/icon_ping@2x.png', drawTools.rpx2px(480), drawTools.rpx2px(345), drawTools.rpx2px(25), drawTools.rpx2px(22));
      } else {
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
        context.fillText('圈子', drawTools.rpx2px(0), drawTools.rpx2px(-20))
      }
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
  saveImage () {
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
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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
    this.getData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    const parmas = {
      target_type: this.data.type === 'Circle' ? 'circles' : 'subject',
      target_id: this.data.id,
    }
    api.share(parmas);
  },

  getData() {
    if (this.data.finish) return
    const param = {
      offset: this.data.events.length,
      limit: 5
    }
    this.getEvents(param)
    this.getDetail(param)
  },
  
  /**
   * 获取话题下的说手
   */
  getEvents(param) {
    api[`get${this.data.type}Events`](param, this.data.id).then(res => {
      const events = [...this.data.events, ...res.data]
      const finish = res.paging.total <= events.length
      this.setData({
        events,
        finish
      })
    })
  },

  /**
   * 获取话题
   */
  getDetail(param) {
    api[`get${this.data.type}Detail`]({}, this.data.id).then(res => {
      this.setData({
        subject: res
      })
    })
  }
})
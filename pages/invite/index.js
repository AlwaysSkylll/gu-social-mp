// pages/invite/index.js
const { formatTime } = require('../../utils/util.js')
const app = getApp()
const drawTools = require('../../utils/draw-tools.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.createPaper();
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  createImage(canvasId) {
    wx.canvasToTempFilePath({
      canvasId: canvasId,
      success: (res) => {
        wx.hideLoading()
        let tempFilePath = res.tempFilePath;
        this.setData({
          sharePaperPath: tempFilePath,
        });
      },
      fail: function (res) {
        console.log(res);
      }
    }, this);
  },

  //点击保存到相册
  saveImage() {
    var that = this
    wx.saveImageToPhotosAlbum({
      filePath: that.data.sharePaperPath,
      success(res) {
        wx.showModal({
          content: '图片已保存到相册，赶紧晒一下吧~',
          showCancel: false,
          confirmText: '好的',
          confirmColor: '#333',
          success: function (res) {
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

  createPaper() {
    const that = this
    const userInfo = wx.getStorageSync('userInfo')
    wx.showLoading({
      title: '名片生成中',
    })

    const context = wx.createCanvasContext('myeventcanvas');
    const width = wx.getSystemInfoSync().windowWidth
    const height = wx.getSystemInfoSync().windowHeight
    context.drawImage('/static/invite_bg.jpg', 0, 0, width, height)
    context.drawImage('/static/qrcode.jpg', width / 2 - drawTools.rpx2px(115), drawTools.rpx2px(500), drawTools.rpx2px(230), drawTools.rpx2px(230))

    drawTools.imgToTempImg(userInfo.avatar_url).then((avatar) => {
      console.log(avatar)
      context.save()
      context.arc(width / 2, drawTools.rpx2px(300), drawTools.rpx2px(50), 0, Math.PI * 2)
      context.clip()
      context.drawImage(avatar, width / 2 - drawTools.rpx2px(50), drawTools.rpx2px(250), drawTools.rpx2px(100),drawTools.rpx2px(100))
      context.restore()
      context.setFillStyle('#000000')
      context.setTextAlign('center')
      context.setFontSize(drawTools.rpx2px(28))
      context.fillText(userInfo.nickname, width / 2, drawTools.rpx2px(400))
      context.draw()
      setTimeout(() => {
        this.createImage('myeventcanvas')
      }, 200)
    })
  },

  createPaper2() {
    const event = this.data.event
    const userInfo = wx.getStorageSync('userInfo')
    wx.showLoading({
      title: '海报生成中',
    })
    const that = this
    const context = wx.createCanvasContext('myeventcanvas', this);
    const canvasHeight = drawTools.rpx2px(570)
    const canvasWidth = drawTools.rpx2px(570)
    context.setTextBaseline('top')
    context.setFillStyle("#ffffff")
    context.fillRect(0, 0, canvasWidth, canvasHeight)

    // 边框
    context.setLineWidth(1)
    context.setLineCap('round')
    context.setLineJoin('round')
    context.setStrokeStyle('#979797')
    context.strokeRect(drawTools.rpx2px(30), drawTools.rpx2px(30), drawTools.rpx2px(520), drawTools.rpx2px(535))

    // 用户信息
    const location = event.location_name.length < 14 ? event.location_name : event.location_name.slice(0, 14) + '...'
    const time = location ? (formatTime(event.create_time) + '  来自  ') : formatTime(event.create_time)
    let title = ''
    if (event.subject) {
      title = event.subject && event.subject.title.length < 8 ? event.subject.title : event.subject.title.slice(0, 8) + '...'
    }

    context.setFillStyle('#000000');
    context.setFontSize(drawTools.rpx2px(22))
    context.fillText(event.user.nickname, drawTools.rpx2px(115), drawTools.rpx2px(50))
    context.setFillStyle('#979797')
    const titleWidth = context.measureText(title + '#').width
    context.save()
    context.setFillStyle('#eeeeee')
    context.fillRect(drawTools.rpx2px(50), drawTools.rpx2px(365), titleWidth, drawTools.rpx2px(36))
    context.restore()
    context.fillText('#' + title, drawTools.rpx2px(50), drawTools.rpx2px(370))

    context.setFontSize(drawTools.rpx2px(16))
    context.fillText(time, drawTools.rpx2px(115), drawTools.rpx2px(80))

    context.setFillStyle('#5cd4ea');
    context.fillText(location, drawTools.rpx2px(220), drawTools.rpx2px(80))


    // 说说内容
    let desc = event.content.length < 18 ? event.content : event.content.slice(0, 18) + '...'
    desc = !!event.images.length ? desc : event.content
    context.setFillStyle('#000000')
    context.setFontSize(drawTools.rpx2px(22))
    const descRowLen = drawTools.drawText(context, desc, drawTools.rpx2px(45), drawTools.rpx2px(90), drawTools.rpx2px(460))


    // 图片部分
    const avatar = event.user.avatar_url
    const qrcode = event.qrcode

    Promise.all([drawTools.imgToTempImg(avatar), drawTools.imgToTempImg(qrcode)]).then((images) => {
      const avatarUrl = images[0]
      const qrcode = images[1]

      context.save()
      context.beginPath()
      context.arc(drawTools.rpx2px(75), drawTools.rpx2px(75), drawTools.rpx2px(30), 0, 2 * Math.PI)
      context.clip()
      context.drawImage(avatarUrl, drawTools.rpx2px(45), drawTools.rpx2px(45), drawTools.rpx2px(60), drawTools.rpx2px(60));
      context.restore()
      context.drawImage(qrcode, drawTools.rpx2px(225), drawTools.rpx2px(430), drawTools.rpx2px(120), drawTools.rpx2px(120));

      if (event.images.length) {
        let imagesPromiseArray = []
        for (let img of event.images) {
          imagesPromiseArray.push(drawTools.imgToTempImg(img))
        }
        return Promise.all(imagesPromiseArray)
      } else {
        return []
      }

    }).then((images) => {
      const length = images.length
      const width = drawTools.rpx2px(Math.min(450 / length, 300))
      const height = drawTools.rpx2px(180)
      const gap = drawTools.rpx2px(60)
      let x = drawTools.rpx2px(45)
      let y = drawTools.rpx2px(160)

      for (let img of images) {
        context.drawImage(img, x, y, width, height);
        x = width + gap
      }

      return images
    }).then(() => {
      context.save()
      context.setTextAlign('center')
      context.setFillStyle('#000000')
      context.setFontSize(drawTools.rpx2px(12))
      context.fillText(event.praise_num, drawTools.rpx2px(530), drawTools.rpx2px(380))
      context.fillText(event.comment_num, drawTools.rpx2px(455), drawTools.rpx2px(380))
      context.fillText(event.share_num, drawTools.rpx2px(375), drawTools.rpx2px(380))
      if (event.praise) {
        context.drawImage('/static/red_like.png', drawTools.rpx2px(480), drawTools.rpx2px(365), drawTools.rpx2px(20), drawTools.rpx2px(35));
      } else {
        context.drawImage('/static/normal_like.png', drawTools.rpx2px(480), drawTools.rpx2px(375), drawTools.rpx2px(20), drawTools.rpx2px(25));
      }
      context.drawImage('/static/normal_comment.png', drawTools.rpx2px(410), drawTools.rpx2px(380), drawTools.rpx2px(20), drawTools.rpx2px(15));
      context.drawImage('/static/normal_share.png', drawTools.rpx2px(325), drawTools.rpx2px(380), drawTools.rpx2px(20), drawTools.rpx2px(15));
      context.restore()

      context.draw()

      setTimeout(() => {
        this.createImage('myeventcanvas')
      }, 200)
    })
  },
})
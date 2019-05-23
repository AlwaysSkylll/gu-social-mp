// pages/invite/index.js
const { formatTime } = require('../../utils/util.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageWidth: wx.getSystemInfoSync().windowWidth
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


  rpx2px(num) {
    return Math.round(this.data.imageWidth / 750 * num)
  },

  drawText(ctx, t, x, y, w) {
    let context = ctx
    let temp = "";
    let row = [];
    let height = 0

    for (let char of t) {
      if (context.measureText(temp).width > w) {
        row.push(temp);
        temp = "";
        height = context.measureText(temp).height
      }
      temp += char;
    }

    row.push(temp);

    for (var b = 0; b < row.length; b++) {
      context.fillText(row[b], x, y + (b + 1) * this.rpx2px(30));
    }

    return row.length
  },

  imgToTempImg(src) {
    return new Promise((resolve, reject) => {
      wx.getImageInfo({
        src,
        success: function (res) {
          if (res.path) {
            resolve(res.path)
          } else {
            reject()
          }
        },
        fail() {
          reject()
        }
      })
    })

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
    context.drawImage('/static/qrcode.jpg', width / 2 - this.rpx2px(115), this.rpx2px(500), this.rpx2px(230), this.rpx2px(230))

    this.imgToTempImg(userInfo.avatar_url).then((avatar) => {
      console.log(avatar)
      context.save()
      context.arc(width / 2, this.rpx2px(300), this.rpx2px(50), 0, Math.PI * 2)
      context.clip()
      context.drawImage(avatar, width / 2 - this.rpx2px(50), this.rpx2px(250), this.rpx2px(100), this.rpx2px(100))
      context.restore()
      context.setFillStyle('#000000')
      context.setTextAlign('center')
      context.setFontSize(this.rpx2px(28))
      context.fillText(userInfo.nickname, width / 2, this.rpx2px(400))
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
    const canvasHeight = this.rpx2px(570)
    const canvasWidth = this.rpx2px(570)
    context.setTextBaseline('top')
    context.setFillStyle("#ffffff")
    context.fillRect(0, 0, canvasWidth, canvasHeight)

    // 边框
    context.setLineWidth(1)
    context.setLineCap('round')
    context.setLineJoin('round')
    context.setStrokeStyle('#979797')
    context.strokeRect(this.rpx2px(30), this.rpx2px(30), this.rpx2px(520), this.rpx2px(535))

    // 用户信息
    const location = event.location_name.length < 14 ? event.location_name : event.location_name.slice(0, 14) + '...'
    const time = location ? (formatTime(event.create_time) + '  来自  ') : formatTime(event.create_time)
    let title = ''
    if (event.subject) {
      title = event.subject && event.subject.title.length < 8 ? event.subject.title : event.subject.title.slice(0, 8) + '...'
    }

    context.setFillStyle('#000000');
    context.setFontSize(this.rpx2px(22))
    context.fillText(event.user.nickname, this.rpx2px(115), this.rpx2px(50))
    context.setFillStyle('#979797')
    const titleWidth = context.measureText(title + '#').width
    context.save()
    context.setFillStyle('#eeeeee')
    context.fillRect(this.rpx2px(50), this.rpx2px(365), titleWidth, this.rpx2px(36))
    context.restore()
    context.fillText('#' + title, this.rpx2px(50), this.rpx2px(370))

    context.setFontSize(this.rpx2px(16))
    context.fillText(time, this.rpx2px(115), this.rpx2px(80))

    context.setFillStyle('#5cd4ea');
    context.fillText(location, this.rpx2px(220), this.rpx2px(80))


    // 说说内容
    let desc = event.content.length < 18 ? event.content : event.content.slice(0, 18) + '...'
    desc = !!event.images.length ? desc : event.content
    context.setFillStyle('#000000')
    context.setFontSize(this.rpx2px(22))
    const descRowLen = this.drawText(context, desc, this.rpx2px(45), this.rpx2px(90), this.rpx2px(460))


    // 图片部分
    const avatar = event.user.avatar_url
    const qrcode = event.qrcode

    Promise.all([this.imgToTempImg(avatar), this.imgToTempImg(qrcode)]).then((images) => {
      const avatarUrl = images[0]
      const qrcode = images[1]

      context.save()
      context.beginPath()
      context.arc(this.rpx2px(75), this.rpx2px(75), this.rpx2px(30), 0, 2 * Math.PI)
      context.clip()
      context.drawImage(avatarUrl, this.rpx2px(45), this.rpx2px(45), this.rpx2px(60), this.rpx2px(60));
      context.restore()
      context.drawImage(qrcode, this.rpx2px(225), this.rpx2px(430), this.rpx2px(120), this.rpx2px(120));

      if (event.images.length) {
        let imagesPromiseArray = []
        for (let img of event.images) {
          imagesPromiseArray.push(this.imgToTempImg(img))
        }
        return Promise.all(imagesPromiseArray)
      } else {
        return []
      }

    }).then((images) => {
      const length = images.length
      const width = this.rpx2px(Math.min(450 / length, 300))
      const height = this.rpx2px(180)
      const gap = this.rpx2px(60)
      let x = this.rpx2px(45)
      let y = this.rpx2px(160)

      for (let img of images) {
        context.drawImage(img, x, y, width, height);
        x = width + gap
        console.log(img, x, y, width)
      }

      return images
    }).then(() => {
      context.save()
      context.setTextAlign('center')
      context.setFillStyle('#000000')
      context.setFontSize(this.rpx2px(12))
      context.fillText(event.praise_num, this.rpx2px(530), this.rpx2px(380))
      context.fillText(event.comment_num, this.rpx2px(455), this.rpx2px(380))
      context.fillText(event.share_num, this.rpx2px(375), this.rpx2px(380))
      if (event.praise) {
        context.drawImage('/static/red_like.png', this.rpx2px(480), this.rpx2px(365), this.rpx2px(20), this.rpx2px(35));
      } else {
        context.drawImage('/static/normal_like.png', this.rpx2px(480), this.rpx2px(375), this.rpx2px(20), this.rpx2px(25));
      }
      context.drawImage('/static/normal_comment.png', this.rpx2px(410), this.rpx2px(380), this.rpx2px(20), this.rpx2px(15));
      context.drawImage('/static/normal_share.png', this.rpx2px(325), this.rpx2px(380), this.rpx2px(20), this.rpx2px(15));
      context.restore()

      context.draw()

      setTimeout(() => {
        this.createImage('myeventcanvas')
      }, 200)
    })
  },
})
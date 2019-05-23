// pages/topic-detail/index.js
const api = require('../../api/index.js')
const { formatTime } = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    subject: {},
    events: [],
    id: 0,
    type: '',
    imageWidth: 0,
    sharePaperPath: '',
    shareCardShow: false,
    shareChoiceShow: false,
    shareEventShow: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
      type: options.type,
      imageWidth: wx.getSystemInfoSync().windowWidth
    })

    wx.setNavigationBarTitle({
      title: options.type === 'Circle' ? '圈子' : '话题'
    })    

    this.getData()
  },

  previewImg() {

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

  rpx2px(num) {
    return Math.round(this.data.imageWidth / 750 * num)
  },

  createCanvas() {
    this.hideShareChoice()
    wx.showLoading({
      title: '海报生成中',
    })
    const that = this
    const context = wx.createCanvasContext('mycanvas');
    const canvasHeight = this.rpx2px(865)
    const canvasWidth = this.rpx2px(575)
    context.setFillStyle("#ffffff")
    context.fillRect(0, 0, canvasWidth, canvasHeight)
    

    // 分享
    const titleY = this.rpx2px(30) + this.rpx2px(15)
    context.setFontSize(this.rpx2px(30));
    context.setFillStyle('#5cd4ea');
    context.setTextAlign('center');
    context.setTextBaseline('middle');
    context.fillText('分享', canvasWidth / 2, titleY);
    context.stroke();

    // 描述区域
    const descY = titleY + this.rpx2px(30)
    const desc = this.data.subject.description
    context.setTextAlign('left');
    context.setFillStyle('#000000');
    context.setFontSize(this.rpx2px(22));
    const descRowLen = this.drawText(context, desc, this.rpx2px(30), descY, canvasWidth - this.rpx2px(60))

    // 话题区域
    const detailY = descY + this.rpx2px(210) + this.rpx2px(110)

    Promise.all([this.imgToTempImg(this.data.subject.covers[0]), this.imgToTempImg(this.data.subject.qrcode)]).then(images => {
      context.drawImage(images[0], this.rpx2px(30), detailY, this.rpx2px(520), this.rpx2px(290));
      context.save()
      context.beginPath()
      context.arc(canvasWidth - this.rpx2px(75), detailY + this.rpx2px(245), this.rpx2px(45), 0, 2 * Math.PI)
      context.clip()
      context.drawImage(images[1], canvasWidth - this.rpx2px(120), detailY + this.rpx2px(200), this.rpx2px(90), this.rpx2px(90));
      context.restore()
      context.draw()

      setTimeout(() => {
        this.createImage('mycanvas', 'shareCardShow')
      }, 200)
    })
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
      }
    })
  },

  showEvent() {
    this.setData({
      shareEventShow: true
    })
  },

  hideEvent() {
    this.setData({
      shareEventShow: false
    })
  },

  shareEvent({detail}) {
    const event = detail
    wx.showLoading({
      title: '海报生成中',
    })
    const that = this
    const context = wx.createCanvasContext('myeventcanvas');
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
    const title = event.subject.title.length < 8 ? event.subject.title : event.subject.title.slice(0, 8) + '...'

    context.setFillStyle('#000000');
    context.setFontSize(this.rpx2px(22))
    context.fillText(event.user.nickname, this.rpx2px(115), this.rpx2px(50))
    context.setFillStyle('#979797')
    const titleWidth = context.measureText(title).width
    context.save()
    context.setFillStyle('#eeeeee')
    context.fillRect(this.rpx2px(50), this.rpx2px(370), titleWidth, this.rpx2px(36))
    context.restore()
    context.fillText('#' + title, this.rpx2px(50), this.rpx2px(370))
    
    context.setFontSize(this.rpx2px(20))
    context.fillText(time, this.rpx2px(115), this.rpx2px(75))
    
    context.setFillStyle('#5cd4ea');
    context.fillText(location, this.rpx2px(220), this.rpx2px(75))
    

    // 说说内容
    let desc = event.content.length < 18 ? event.content : event.content.slice(0, 18) + '...'
    desc = !!event.images.length ? desc : event.content
    context.setFillStyle('#000000')
    context.setFontSize(this.rpx2px(22))
    const descRowLen = this.drawText(context, desc, this.rpx2px(45), this.rpx2px(90), this.rpx2px(460))


    // 图片部分
    const avatar = event.user.avatar_url
    const qrcode = event.qrcode

    Promise.all([this.imgToTempImg(avatar), this.imgToTempImg(qrcode)]).then((images) =>{
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
        this.createImage('myeventcanvas', 'shareEventShow')
      }, 200)
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

  getData() {
    this.getEvents()
    this.getDetail()
  },
  
  /**
   * 获取话题下的说手
   */
  getEvents() {
    api[`get${this.data.type}Events`]({}, this.data.id).then(res => {
      this.setData({
        events: res.data
      })
    })
  },

  /**
   * 获取话题
   */
  getDetail() {
    api[`get${this.data.type}Detail`]({}, this.data.id).then(res => {
      this.setData({
        subject: res
      })
    })
  }
})
// pages/topic-detail/index.js
const api = require('../../api/index.js')

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
    shareCardShow: false
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

  px2rpx(num) {
    return Math.round(this.data.imageWidth / 750 * num)
  },

  createCanvas() {
    if (this.data.sharePaperPath) {
      this.showCard()
      return
    }
    wx.showLoading({
      title: '海报生成中',
    })
    const that = this
    const context = wx.createCanvasContext('mycanvas');
    const canvasHeight = this.px2rpx(865)
    const canvasWidth = this.px2rpx(575)
    context.setFillStyle("#ffffff")
    context.fillRect(0, 0, canvasWidth, canvasHeight)
    

    // 分享
    const titleY = this.px2rpx(30) + this.px2rpx(15)
    context.setFontSize(this.px2rpx(30));
    context.setFillStyle('#5cd4ea');
    context.setTextAlign('center');
    context.setTextBaseline('middle');
    context.fillText('分享', canvasWidth / 2, titleY);
    context.stroke();

    // 描述区域
    const descY = titleY + this.px2rpx(30)
    const desc = this.data.subject.description
    context.setTextAlign('left');
    context.setFillStyle('#000000');
    context.setFontSize(this.px2rpx(22));
    const descRowLen = this.drawText(context, desc, this.px2rpx(30), descY, canvasWidth - this.px2rpx(60))

    // 话题区域
    // const detailY = descY + descRowLen * this.px2rpx(30) + this.px2rpx(10) 
    const detailY = descY + this.px2rpx(210) + this.px2rpx(110)

    Promise.all([this.imgToTempImg(this.data.subject.covers[0]), this.imgToTempImg(this.data.subject.qrcode)]).then(images => {
      context.drawImage(images[0], this.px2rpx(30), detailY, this.px2rpx(520), this.px2rpx(290));
      context.drawImage(images[1], canvasWidth - this.px2rpx(120), detailY + this.px2rpx(200), this.px2rpx(90), this.px2rpx(90));
      context.draw()

      setTimeout(() => {
        wx.canvasToTempFilePath({
          canvasId: 'mycanvas',
          success: function (res) {
            wx.hideLoading()
            let tempFilePath = res.tempFilePath;
            that.setData({
              sharePaperPath: tempFilePath,
              shareCardShow: true
            });
          },
          fail: function (res) {
            console.log(res);
          }
        });
      }, 200)
    })
    // const detailDescY = detailY + this.px2rpx(290) + this.px2rpx(25)
    // const detailDescContext = this.data.subject.title > 8 ? `${this.data.subject.title.slice(0, 8)}...` : this.data.subject.title
    // context.fillText(`#${detailDescContext}`, this.px2rpx(45), detailDescY);
    // context.setTextAlign('right');
    // context.fillText(`xxxxxx`, canvasWidth - this.px2rpx(45), detailDescY);



    // context.draw()
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
      context.fillText(row[b], x, y + (b + 1) * this.px2rpx(30));
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
    const that = this
    wx.setClipboardData({
      data: this.data.subject.description,
      success: () => {
        wx.showToast({
          title: '已复制到剪切板',
        })
      }
    })
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
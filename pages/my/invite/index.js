// pages/invite/index.js
const { formatTime } = require('../../../utils/util.js')
const app = getApp()
const drawTools = require('../../../utils/draw-tools.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.createPaper(0, '#ffffff');
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

  createImage(canvasId, index) {
    wx.canvasToTempFilePath({
      canvasId,
      success: (res) => {
        wx.hideLoading()
        let tempFilePath = res.tempFilePath;
        this.setData({
          [`sharePaperPath[${index}]`]: tempFilePath,
          currentIndex: ++ index,
        });
        if (index == 3) return
        const color = index < 2 ? '#ffffff' : '#000000'
        this.createPaper(index, color)
      },
      fail: function (res) {
        console.log(res);
      }
    }, this);
  },

  //点击保存到相册
  saveImage(e) {
    const index = e.currentTarget.dataset.index;
    const that = this
    const saveToPhotos = () => {
      wx.saveImageToPhotosAlbum({
        filePath: that.data.sharePaperPath[index],
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
    }

    wx.showModal({
      content: '是否保存到相册？',
      showCancel: false,
      confirmText: '好的',
      confirmColor: '#333',
      showCancel: true,
      success: function (res) {
        console.log(res)
        if (res.confirm) saveToPhotos()
      }
    })
  },

  createPaper(index, color) {
    const that = this
    const userInfo = wx.getStorageSync('userInfo')
    wx.showLoading({
      title: '名片生成中',
    })

    const context = wx.createCanvasContext('myeventcanvas');
    const width = wx.getSystemInfoSync().windowWidth
    const height = wx.getSystemInfoSync().windowHeight
    context.drawImage(`/static/share_${index}.jpg`, 0, 0, width, height)
    context.drawImage(userInfo.qrcode, width / 2 - drawTools.rpx2px(100), drawTools.rpx2px(900), drawTools.rpx2px(200), drawTools.rpx2px(200))

    drawTools.imgToTempImg(userInfo.avatar_url).then((avatar) => {
      console.log(avatar)
      context.save()
      context.arc(width / 2, drawTools.rpx2px(150), drawTools.rpx2px(50), 0, Math.PI * 2)
      context.clip()
      context.drawImage(avatar, width / 2 - drawTools.rpx2px(50), drawTools.rpx2px(100), drawTools.rpx2px(100),drawTools.rpx2px(100))
      context.restore()
      context.setFillStyle(color)
      context.setTextAlign('center')
      context.setFontSize(drawTools.rpx2px(28))
      context.fillText(userInfo.nickname, width / 2, drawTools.rpx2px(250))
      context.draw()
      setTimeout(() => {
        this.createImage('myeventcanvas', index)
      }, 200)
    })
  },
})
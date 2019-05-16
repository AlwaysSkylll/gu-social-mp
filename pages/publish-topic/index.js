// pages/publish/index.js
const api = require('../../api/index.js')
const host = require('../../config.js').host
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    topic: {
      images: [],
      title: '',
      description: '',
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
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
   * 更新文本
   */
  updateContext(e) {
    console.log(e)
    const type = e.currentTarget.dataset.type
    this.setData({
      [`topic.${type}`]: e.detail.value
    })
  },

  /**
   * 上传图片
   */
  uploadImg(e) {
    const self = this
    const count = 4 - this.data.topic.images.length

    wx.chooseImage({
      count,
      sizeType: ['compressed'],
      success: (e) => {
        console.log(e, 'success')
        const toBase64Images = e.tempFilePaths.map(filePath => 'data:image/jpeg;base64,' + wx.getFileSystemManager().readFileSync(filePath, 'base64'))
      
        toBase64Images.map(image => {
          api.uploadImage({ image }).then(({url}) => {
            this.setData({
              ['topic.images']: [url, ...this.data.topic.images]
            })
          })
        })
      },
      fail: (e) => {
        console.log(e, 'fail')
      }
    })
  },
})
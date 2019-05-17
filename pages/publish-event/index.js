// pages/publish-event/index.js
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
    btnStatus: false,
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
    const btnStatus = this.data.topic.title && this.data.topic.description
    this.setBtnStatus(btnStatus)
  },

  setBtnStatus(status) {
    console.log(status, 88888)
    if (status == this.data.btnStatus) return
    this.setData({ btnStatus: status })
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
        this.setData({
          ['topic.images']: [...this.data.topic.images, ...toBase64Images]
        })
        // toBase64Images.map(image => {
        //   api.uploadImage({ image }).then(({url}) => {
        //     this.setData({
        //       ['topic.images']: [...this.data.topic.images, url]
        //     })
        //   })
        // })
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
   * 发布
   * param {
   *    title
   *    description
   *    notify_user_ids[]
   * }
   */
  publish() {
    api.postSubject({
      title: this.data.topic.title,
      description: this.data.topic.description,
      circles_id: 8,
      covers: this.data.topic.images,
    }).then((e) => {
      wx.showToast({
        title: '发布成功',
      })
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/home/index',
          mask: true
        })
      }, 2000)
    })
  }
})
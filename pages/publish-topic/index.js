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
    selectTopic: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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

  deleteImg(e) {
    const index = e.currentTarget.dataset.index
    const images = this.data.topic.images
    this.setData({
      [`topic.images`]: []
    })
    for (let i = 0; i < images.length; i++) {
      if (i === index && i === 0) {
        continue
      }
      if (i === index) {
        continue
      }
      if (i > index) {
        this.setData({
          [`topic.images[${i - 1}]`]: images[i]
        })
      } else if (i < index) {
        this.setData({
          [`topic.images[${i}]`]: images[i]
        })
      }
    }
  },

  /**
   * 上传图片
   */
  uploadImg(e) {
    const self = this
    const alreadyCount = this.data.topic.images.length
    const count = 9 - alreadyCount

    wx.chooseImage({
      count,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (e) => {
        console.log(e, 'success')
        const toBase64Images = e.tempFilePaths.map(filePath => 'data:image/jpeg;base64,' + wx.getFileSystemManager().readFileSync(filePath, 'base64'))
        const imgCount = e.tempFilePaths.length
        for (let i = 0; i < imgCount; i++) {
          this.setData({
            [`topic.images[${alreadyCount + i}]`]: toBase64Images[i]
          })
        }
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
    if (!this.data.selectTopic.id) {
      wx.showToast({
        icon: 'none',
        title: '请选择圈子',
      })
      return
    }
    if (!this.data.btnStatus) return;
    api.postSubject({
      title: this.data.topic.title,
      description: this.data.topic.description,
      circles_id: this.data.selectTopic.id,
      covers: this.data.topic.images,
    }).then((e) => {
      wx.showToast({
        title: '发布成功，请等待审核结果',
      })
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/home/index',
          success: function (e) {
            let page = getCurrentPages().pop();
            if (page == undefined || page == null) return;
            page.onLoad();
          }
        })
      }, 1500)
    })
  },
  showModal() {
    wx.navigateTo({
      url: `/pages/publish-topic-select/index?type=Circle`,
    })
  },

  selectTopic(topic) {
    this.setData({
      selectTopic: topic,
    })
  }
})
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
    event: {
      images: [],
      content: '',
      subject_id: 0,
      notify_user_ids: [],
      location_name: '',
      location_address: '',
      location_latitude: '',
      location_longitude: '',
    },
    btnStatus: false,
    topics: [],
    selectTopic: {},
    showModal: false,
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
    const self = this
    wx.showToast({
      icon: 'loading',
    })
    wx.getLocation({
      success: (res) => {
        console.log(res)
        wx.request({
          url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${res.latitude},${res.longitude}&key=CLKBZ-FZ26X-S2I4I-7BXMC-USQ53-KUFOM`,
          success: ({ data }) => {
            const result = data.result
            console.log(data) 
            if (!result) {
              wx.showToast({
                icon: 'none',
                title: '获取地理位置失败'
              })
              return;
            }
            wx.hideToast()
            self.setData({
              ['event.location_name']: result.address_component.city,
              ['event.location_address']: result.address_component.district + result.address_component.street,
              ['event.location_latitude']: res.latitude,
              ['event.location_longitude']: res.longitude,
            })
          } 
        })
      },
    })
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
      [`event.content`]: e.detail.value
    })
    const btnStatus = this.data.event.content
    this.setBtnStatus(btnStatus)
  },

  setBtnStatus(status) {
    if (status == this.data.btnStatus) return
    this.setData({ btnStatus: status })
  },

  /**
   * 上传图片
   */
  uploadImg(e) {
    const self = this
    const count = 4 - this.data.event.images.length

    wx.chooseImage({
      count,
      sizeType: ['compressed'],
      success: (e) => {
        console.log(e, 'success')
        const toBase64Images = e.tempFilePaths.map(filePath => 'data:image/jpeg;base64,' + wx.getFileSystemManager().readFileSync(filePath, 'base64'))
        this.setData({
          ['event.images']: [...this.data.event.images, ...toBase64Images]
        })
        // toBase64Images.map(image => {
        //   api.uploadImage({ image }).then(({url}) => {
        //     this.setData({
        //       ['event.images']: [...this.data.event.images, url]
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
    const imgLink = this.data.event.images[index]
    if (!imgLink) {
      return;
    }
    wx.previewImage({
      current: imgLink,
      urls: this.data.event.images
    })
  },

  /**
   * 发布
   */
  publish() {
    if (!this.data.btnStatus) return;
    api.publishEvent(this.data.event).then((e) => {
      wx.showToast({
        title: '发布成功',
        mask: true,
      })
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/home/index',
          mask: true
        })
      }, 1500)
    })
  },

  showModal() {
    if (!this.data.topics.length) {
      api.searchSubject({}).then(({data}) => {
        this.setData({
          topics: data,
          showModal: true
        })
      })
    } else {
      this.setData({
        showModal: true
      })
    }
  },

  hideModal() {
    this.setData({
      showModal: false
    })
  },

  selectTopic(e) {
    const topic = e.detail
    this.setData({
      ['event.subject_id']: topic.id,
      selectTopic: topic
    })
    this.hideModal();
  }
})
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
      notify_user_ids: [],
      location_name: '',
      location_address: '',
      location_latitude: '',
      location_longitude: '',
    },
    btnStatus: false,
    topics: [],
    eventType: '',
    selectTopic: {
      title: ''
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!options) return
    const id = options.id || ''
    const type = options.type || 'Subject'
    const isCircleType = type === 'Circle'
    const isActivityType = type === 'Activity'
    const title = isCircleType ? '' : (options.title || '')

    if (!isActivityType) {
      this.setData({
        ['selectTopic.title']: title,
        ['event.subject_id']: isCircleType ? '' : id,
        ['event.circles_id']: isCircleType ? id : '',
        eventType: type
      })
      return
    }

    this.setData({
      ['selectTopic.title']: title,
      ['event.activity_id']: id,
      eventType: type
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const self = this
    
    wx.getLocation({})
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

  deleteImg(e) {
    const index = e.currentTarget.dataset.index
    const images = this.data.event.images
    this.setData({
      [`event.images`]: []
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
          [`event.images[${i - 1}]`]: images[i]
        })
      } else if (i < index) {
        this.setData({
          [`event.images[${i}]`]: images[i]
        })
      }
    }
  },

  /**
   * 上传图片
   */
  uploadImg(e) {
    const self = this
    const alreadyCount = this.data.event.images.length
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
            [`event.images[${alreadyCount + i}]`]: toBase64Images[i]
          })
        }
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
  publish(e) {
    console.log(e.detail.formId, 'formid')
    const formid = e.detail.formId
    if (!this.data.btnStatus) return;
    let param = this.data.event
    
    api.publishEvent({ ...param, formid}).then((e) => {
      wx.showToast({
        title: '请等待审核结果',
        mask: true,
      })
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/my/index',
          success: function (e) {
            let page = getCurrentPages().pop();
            console.log(page, 'switchTab')
            if (page == undefined || page == null) return;
            page.onLoad();
          }
        })
      }, 1500)
    })
  },

  showModal() {
    const eventType = this.data.eventType
    const isCircleType = eventType === 'Circle'

    const query = isCircleType ? `type=${eventType}&id=${this.data.event.circles_id}` : `type=${eventType}`
    wx.navigateTo({
      url: `/pages/publish-topic-select/index?${query}`,
    })
  },

  selectTopic(topic) {
    if (this.data.eventType === 'Activity') {
      this.setData({
        ['event.activity_id']: topic.id,
        selectTopic: topic
      })
      return
    }
    this.setData({
      ['event.subject_id']: topic.id,
      selectTopic: topic
    })
  },

  getLocation() {
    this.checkLocation()
  },

  checkLocation() {
    const self = this
    //判断是否获得了用户地理位置授权
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.userLocation']) {
          self.confirmLocation()
          return
        }
        wx.chooseLocation({
          success: function(res) {
            self.setData({
              ['event.location_name']: res.name,
              ['event.location_address']: res.address,
              ['event.location_latitude']: res.latitude,
              ['event.location_longitude']: res.longitude,
            })
          },
        })
      }
    })
  },

  confirmLocation() {
    wx.showModal({
      content: '检测到您没打开定位权限，是否去设置打开？',
      confirmText: "确认",
      cancelText: "取消",
      success: function (res) {
        console.log(res);
        //点击“确认”时打开设置页面
        if (res.confirm) {
          console.log('用户点击确认')
          wx.openSetting({
            success: (res) => { }
          })
        } else {
          console.log('用户点击取消')
        }
      }
    });
  }
})
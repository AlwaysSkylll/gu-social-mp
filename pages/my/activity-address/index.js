const api = require('../../../api/index.js')

// pages/my/activity-address/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: undefined,
    product: {},
    address: {},
    remark: '',
    btnStatus: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const id = options.id;
    this.getData(id)
    this.setData({ id })
  },

  getData(id) {
    api.getProductInfo({}, id).then(res => {
      const product = res;
      this.setData({ product })
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

  chooseAddress() {
    const self = this;
    wx.getSetting({
      success: (res) => {
        // if (!res.authSetting['scope.address']) {
        //   self.confirmLocation()
        //   return
        // }
        wx.chooseAddress({
          success(res) {
            console.log(res)
            self.setData({ address: res })
          },
        })
      }
    })
  },

  // confirmLocation() {
  //   wx.showModal({
  //     content: '检测到您没打开获取通讯地址权限，是否去设置打开？',
  //     confirmText: "确认",
  //     cancelText: "取消",
  //     success: function (res) {
  //       console.log(res);
  //       //点击“确认”时打开设置页面
  //       if (res.confirm) {
  //         console.log('用户点击确认')
  //         wx.openSetting({
  //           success: (res) => {
  //             res.authSetting = {
  //               "scope.address": true,
  //             }
  //           }
  //         })
  //       } else {
  //         console.log('用户点击取消')
  //       }
  //     }
  //   });
  // },

  /**
   * 更新文本
   */
  updateContext(e) {
    this.setData({ remark: e.detail.value })
  },

  saveHandler() {
    if (!this.data.btnStatus) return
    if (!this.data.address.telNumber) {
      wx.showToast({
        title: '请先选择收货地址',
        icon: 'none',
      })
      return
    }
    this.setBtnStatus(false)
    const address = this.data.address;
    delete(address.errMsg)
    const params = {
      address: this.data.address,
      remark: this.data.remark,
      num: 1
    }
    api.createOrder(params, this.data.id).then(res => {
      wx.navigateBack({})
    })
  },

  setBtnStatus(status) {
    this.setData({ btnStatus: status })
  }
})
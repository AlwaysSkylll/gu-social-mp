// pages/my/editinfo/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeDesc: '',
    typeArray: {
      school: '',
      nickname: '',
      position: '示例：销售经理、项目经理、xxx店长、数学老师',
      hobby: ''
    },
    name: '',
    type: '',
    value: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {type, name, value} = options
    wx.setNavigationBarTitle({
      title: name,
    }),
    this.setData({
      name,
      type,
      value
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

  bindKeyInput(e) {
    this.setData({
      value: e.detail.value
    })
  },

  saveHandler() {
    const self = this
    const { type, value } = self.data
    if (value.length === 0) return
    const pages = getCurrentPages()
    const beforePage = pages[pages.length - 2]
    wx.navigateBack({
      success() {
        beforePage.setData({
          [`userInfo.${type}`]: value
        })
        console.log(page, value)
      }
    })
  }
})
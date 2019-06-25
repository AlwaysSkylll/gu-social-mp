// pages/my/info/index.js
const utils = require('../../../utils/util.js')
const api = require('../../../api/index.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    infoList: [
      // {
      //   name: '头像',
      //   type: 'avatar',
      //   path: ''
      // }, 
      {
        name: '昵称',
        type: 'nickname',
        path: ''
      }, {
        name: '性别',
        type: 'gender_name',
        path: ''
      }, {
        name: '生日',
        type: 'birthday',
        path: ''
      }, {
        name: '学校',
        type: 'school',
        path: ''
      }, {
        name: '职位',
        type: 'position',
        path: ''
      }, {
        name: '爱好',
        type: 'hobby',
        path: ''
      }
    ],
    date: '2019-07-01',
    genderList: ['未知', '男', '女'],
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const userInfo = wx.getStorageSync('userInfo')
    const nowDate = new Date()
    this.setData({
      date: utils.formatSimpleDate(nowDate),
      userInfo
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

  simpleListHandler(e) {
    const name = e.currentTarget.dataset.name
    const type = e.currentTarget.dataset.type

    if (['nickname', 'school', 'position', 'hobby'].includes(type)) {
      wx.navigateTo({
        url: `/pages/my/editinfo/index?type=${type}&name=${name}&value=${this.data.userInfo[type]}`,
      })
    }
    
  },

  bindDateChange(e) {
    this.setData({
      ['userInfo.birthday']: e.detail.value
    })
  },

  bindGenderChange(e) {
    const gender = parseInt(e.detail.value)
    console.log(gender)
    debugger
    this.setData({
      ['userInfo.gender']: gender,
    })
  },

  saveHandler() {
    const userInfo = this.data.userInfo

    api.setUserInfo(userInfo).then(res => {
      wx.setStorageSync('userInfo', res)
      app.globalData.userInfo = res
      wx.showToast({
        title: "更新成功",
      })
    })
  }
})
// pages/components/event-card/index.js
const api = require('../../../api/index.js')
const { formatTime } = require('../../../utils/util.js')
const drawTools = require('../../../utils/draw-tools.js')
const app = getApp()

Component({
  externalClasses: ['cu-modal', 'show', 'share-paper-card', 'share-img', 'share-button', 'btn', 'share-canvas'],
  /**
   * 组件的属性列表
   */
  properties: {
    event: {
      type: Object,
      value: null
    },
    type: {
      type: String,
      value: ''
    },
    callback: {
      type: Boolean,
      value: true
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    user: wx.getStorageSync('userInfo'),
    hovered: false,
    shareEventShow: false,
    tapNum: 0,
  },

  attached() {
    this.setData({
      user: wx.getStorageSync('userInfo'),
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toDetail() {
      if (!this.data.callback) return
      let id = 0;
      if (this.properties.event) {
        id = this.properties.event.id
      }
      wx.navigateTo({
        url: `/pages/event-detail/index?id=${id}`,
      })
    },
    imgLoadError(e) {
      // const index = e.currentTarget.dataset.index
      // this.setData({
      //   [`event.images[${index}]`]: '/static/default_ground.jpg'
      // })
    },
    setFollow(e) {
      const status = e.detail
      if (this.data.event.user.follow == status) return
      this.setData({
        ['event.user.follow']: status
      })
    },
    // shareEvent() {
    //   this.triggerEvent('shareEvent', this.data.event)
    // },
    setPraise() {
      const status = !this.data.event.praise
      let praise_num = this.data.event.praise_num || 0
      const callback = (praiseNum) => {
        this.setData({
          ['event.praise']: status,
          ['event.praise_num']: praise_num < 0 ? 0 : praise_num,
          tapNum: ++ this.data.tapNum
        })
      }
      const param = {
        target_type: 'event',
        target_id: this.data.event.id,
      }
      if (status) {
        api.praise(param).then(res => {
          callback(praise_num++)
        })
      } else {
        api.unpraise(param).then(res => {
          callback(praise_num--)
        })
      }
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

    setHoverStatus(status) {
      if (this.data.hovered === status) return
      this.setData({
        hovered: status
      })
    },

    hoverCard() {
      this.setHoverStatus(true)
    },
    unHoverCard() {
      this.setHoverStatus(false)
    },
    /**
     * 前往主题详情
     */
    goSubjectDetail() {
      const id = this.data.event.subject && this.data.event.subject.id
      const type = 'Subject'
      if (!id) return
      wx.navigateTo({
        url: `/pages/topic-detail/index?id=${id}&type=${type}`,
      })
    },

    createImage(canvasId, canvasShowProperty) {
      wx.canvasToTempFilePath({
        canvasId: canvasId,
        success: (res) => {
          wx.hideLoading()
          let tempFilePath = res.tempFilePath;
          this.setData({
            startDrawCanvas: false,
            sharePaperPath: tempFilePath,
            [canvasShowProperty]: true
          });
        },
        fail: function (res) {
          console.log(res);
        }
      }, this);
    },

    //点击保存到相册
    saveImage() {
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
            }
          })
        },
        fail: function (res) {
          if (res.errMsg === "saveImageToPhotosAlbum:fail auth deny" || res.errMsg === "saveImageToPhotosAlbum:fail:auth denied") {
            app.requestSaveImgPermission()
          }
        }
      })
    },

    showEvent() {
      this.setData({
        shareEventShow: true
      })
    },

    hideEvent() {
      this.setData({
        shareEventShow: false
      })
    },

    shareEvent() {
      this.setData({
        startDrawCanvas: true
      })
      const event = this.data.event
      wx.showLoading({
        title: '海报生成中',
      })
      const that = this
      const context = wx.createCanvasContext('myeventcanvas', this);
      const canvasHeight = drawTools.rpx2px(885)
      const canvasWidth = drawTools.rpx2px(575)
      context.setTextBaseline('top')
      context.setFillStyle("#ffffff")
      context.fillRect(0, 0, canvasWidth, canvasHeight)

      // 用户信息
      const location = event.location_name.length < 14 ? event.location_name : event.location_name.slice(0, 14) + '...'
      const time = location ? (formatTime(event.create_time) + '  来自  ') : formatTime(event.create_time)
      let title = ''
      if (event.subject) {
        title = event.subject && event.subject.title.length < 8 ? event.subject.title : event.subject.title.slice(0, 8) + '...'
      }

      context.setFillStyle('#000000');
      context.setFontSize(drawTools.rpx2px(22))
      context.fillText(event.user.nickname, drawTools.rpx2px(115), drawTools.rpx2px(340))
      context.setFillStyle('#979797')
      const titleWidth = context.measureText(title + '#').width + drawTools.rpx2px(20)
      context.save()
      context.setFillStyle('#eeeeee')
      context.fillRect(drawTools.rpx2px(45), drawTools.rpx2px(595), titleWidth, drawTools.rpx2px(36))
      context.restore()
      context.fillText('#' + title, drawTools.rpx2px(50), drawTools.rpx2px(600))

      context.setFontSize(drawTools.rpx2px(16))
      context.fillText(time, drawTools.rpx2px(115), drawTools.rpx2px(370))

      context.setFillStyle('#5cd4ea');
      context.fillText(location, drawTools.rpx2px(220), drawTools.rpx2px(370))


      // 说说内容
      let desc = event.content.length < 18 ? event.content : event.content.slice(0, 18) + '...'
      desc = !!event.images.length ? desc.split('\n')[0] : event.content
      context.setFillStyle('#000000')
      context.setFontSize(drawTools.rpx2px(22))
      const descRowLen = drawTools.drawText(context, desc, drawTools.rpx2px(45), drawTools.rpx2px(380), drawTools.rpx2px(470), 6)

      // 虚线
      context.save()
      context.setLineWidth(drawTools.rpx2px(1))
      context.setStrokeStyle('#eeeeee');
      context.setLineDash([drawTools.rpx2px(10), drawTools.rpx2px(3)], 0)
      context.beginPath()
      context.moveTo(0, drawTools.rpx2px(650))
      context.lineTo(drawTools.rpx2px(575), drawTools.rpx2px(650))
      context.stroke()
      context.restore()


      // 图片部分
      const avatar = event.user.avatar_url
      const qrcode = event.qrcode

      Promise.all([drawTools.imgToTempImg(avatar), drawTools.imgToTempImg(qrcode)]).then((images) => {
        const avatarUrl = images[0]
        const qrcode = images[1]

        context.save()
        context.beginPath()
        context.arc(drawTools.rpx2px(75), drawTools.rpx2px(365), drawTools.rpx2px(30), 0, 2 * Math.PI)
        context.clip()
        context.drawImage(avatarUrl, drawTools.rpx2px(45), drawTools.rpx2px(335), drawTools.rpx2px(60), drawTools.rpx2px(60));
        context.restore()
        context.drawImage(qrcode, drawTools.rpx2px(217), drawTools.rpx2px(670), drawTools.rpx2px(140), drawTools.rpx2px(140));

        if (event.images.length) {
          let imagesPromiseArray = []
          for (let img of event.images.slice(0, 3)) {
            imagesPromiseArray.push(drawTools.imgToTempImg(img))
          }
          return Promise.all(imagesPromiseArray)
        } else {
          return []
        }

      }).then((images) => {
        const length = images.length
        const width = drawTools.rpx2px(160)
        const height = drawTools.rpx2px(120)
        const gap = drawTools.rpx2px(60)
        let x = drawTools.rpx2px(45)
        let y = drawTools.rpx2px(460)

        for (let img of images) {
          context.drawImage(img, x, y, width, height);
          x = width + gap
        }

        return images
      }).then(() => {
        if (event.subject && event.subject.covers && event.subject.covers[0]) {
          return drawTools.imgToTempImg(event.subject.covers[0])
        } else {
          return api.exploreSwiper().then((res) => drawTools.imgToTempImg(res.img))
        }
      }).then((cover) => {
        if (cover) {
          context.drawImage(cover, drawTools.rpx2px(0), drawTools.rpx2px(0), drawTools.rpx2px(575), drawTools.rpx2px(320));
        } else {
          context.drawImage('/static/default_banner.jpg', drawTools.rpx2px(0), drawTools.rpx2px(0), drawTools.rpx2px(575), drawTools.rpx2px(320));
        }
        context.save()
        context.setTextAlign('center')
        context.setFillStyle('#000000')
        context.setFontSize(drawTools.rpx2px(14))
        context.fillText(event.praise_num, drawTools.rpx2px(530), drawTools.rpx2px(610))
        context.fillText(event.comment_num, drawTools.rpx2px(455), drawTools.rpx2px(610))
        context.fillText(event.share_num, drawTools.rpx2px(375), drawTools.rpx2px(610))
        if (event.praise) {
          context.drawImage('/static/red_like.png', drawTools.rpx2px(480), drawTools.rpx2px(595), drawTools.rpx2px(20), drawTools.rpx2px(35));
        } else {
          context.drawImage('/static/normal_like.png', drawTools.rpx2px(480), drawTools.rpx2px(605), drawTools.rpx2px(20), drawTools.rpx2px(25));
        }
        context.drawImage('/static/normal_comment.png', drawTools.rpx2px(410), drawTools.rpx2px(610), drawTools.rpx2px(20), drawTools.rpx2px(15));
        context.drawImage('/static/normal_share.png', drawTools.rpx2px(325), drawTools.rpx2px(610), drawTools.rpx2px(20), drawTools.rpx2px(15));
        context.restore()

        context.draw()

        setTimeout(() => {
          this.createImage('myeventcanvas', 'shareEventShow')
        }, 200)
      })
    },
    previewImg() {

    }
   }
})

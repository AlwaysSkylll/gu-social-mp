// pages/components/comment-item/index.js
const api = require('../../../api/index.js')

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      value: null
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    setPraise() {
      const status = !this.data.item.praise
      let praise_num = this.data.item.praise_num || 0
      const callback = (praiseNum) => {
        this.setData({
          ['item.praise']: status,
          ['item.praise_num']: praise_num < 0 ? 0 : praise_num
        })
      }
      const param = {
        target_type: 'comment',
        target_id: this.data.item.id,
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
    }
  }
})

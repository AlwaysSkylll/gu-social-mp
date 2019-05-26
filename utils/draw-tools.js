const imageWidth = wx.getSystemInfoSync().windowWidth

var drawText = function(ctx, t, x, y, w) {
  let context = ctx
  let temp = "";
  let row = [];
  let height = 0

  for (let char of t) {
    if (context.measureText(temp).width > w || char === '\n') {
      row.push(temp)
      temp = ""
      height = context.measureText(temp).height
    }
    if (char !== '\n') temp += char
  }

  row.push(temp)

  for (let b = 0; b < row.length; b++) {
    if (b == 7) {
      context.fillText(row[b].slice(0, -2) + '...', x, y + (b + 1) * rpx2px(30))
      return 8
    } else {
      context.fillText(row[b], x, y + (b + 1) * rpx2px(30))
    }
  }

  return row.length
}

var rpx2px = function(num) {
  return Math.round(imageWidth / 750 * num)
}

var imgToTempImg = function(src) {
  return new Promise((resolve, reject) => {
    wx.getImageInfo({
      src,
      success: function (res) {
        if (res.path) {
          // const img = wx.getImageInfo({
          //   src: res.path,
          //   success: (res) => {
          //     console.log(res, 9999)
          //   }
          // })
          resolve(res.path)
        } else {
          reject()
        }
      },
      fail() {
        reject()
      }
    })
  })
}

module.exports = {
  rpx2px,
  drawText,
  imgToTempImg
}


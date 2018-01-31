let mixin = require('../../utils/mixin'),
  mx = null,
  app = getApp(),
  unionid = wx.getStorageSync('unionid')

Page({
  data: {
    layer: {
      show: true,
      state: '',
      content: ''
    },
    title: '',
    message: '',
    section: [

    ],

  },
  onLoad: function (options) {
    let t = this,
      post_data = wx.getStorageSync('post_data'),
      post_title = wx.getStorageSync('post_title'),
      post_message = wx.getStorageSync('post_message')
    mx = new mixin(t)

    if (!!post_title) {
      t.setData({
        title: post_title
      })
      //console.log('title: ',post_title)
    }

    if (!!post_message) {
      t.setData({
        message: post_message
      })
      //console.log('message: ',post_message)
    }

    if (!!post_data) {
      let firstTitle = t.firstTitle(post_data)

      t.setData({
        section: firstTitle
      })
      console.log('section: ', firstTitle)
    }
  },
  firstTitle: function (d) { //重置标题
    let t = this,
      first = { img: d[0].img, content: t.data.title }
    d.splice(0, 1, first)
    return d
  },
  saveTemp: function () { //存为草稿
    //console.log('saveTemp: ',this.data.section)
  },
  publish: function () { //立即发布
    let t = this,
      pall = [];
    //console.log('publish: ', this.data.section)
    var section = t.data.section
    //console.log('section: ',section)
    for (let item in section) {
      console.log(section[item].img)
      pall.push(t.uploadFile(section[item].img))
    }

    Promise.all(pall).then(values => {//全部图片上传成功
      t.data.section.map((v, i, a) => {
        v.img = values[i]
      })
      t.setData({
        section: t.data.section //更新服务器图片
      });
      
      //调用发帖接口:
      wx.request({
        url: app.appUrl + 'userPublish', //仅为示例，非真实的接口地址
        data: {
          unionid: unionid,
          title: t.data.title,
          description: t.data.message,
          section: t.data.section
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res.data)
          //发帖成功后清除缓存:
          wx.removeStorageSync('post_message')
          wx.removeStorageSync('post_title')
          wx.removeStorageSync('post_data')
          //发帖成功的后续处理:
          mx.layer({ content: '发帖成功', time: 2 })
          setTimeout(function () {
            wx.navigateTo({
              url: '/pages/bbs/bbs', //跳转路径
            })
          }, 2000)
        }
      })


    })

  },
  uploadFile: function (img) {
    return new Promise(function (resolve, reject) {
      wx.uploadFile({
        url: app.appUrl + 'sappimg2upyun', //仅为示例，非真实的接口地址
        filePath: img,
        name: 'file',
        header: {
          'content-type': 'multipart/form-data'
        },
        formData: {
        },
        success: function (res) {
          img = res.data
          console.log('success: ', res.data)
          resolve(res.data)
        },
        fail: function (res) {
          console.log('fail: ', res)
          reject(res)
        }
      })
    })
  }
})
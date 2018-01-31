var app = getApp(),
  mixin = require('../../utils/mixin'),
  mx = null

Page({

  data: {
    list: '',
    next_page_url:'',
    author:'',
    recordshow: true,
    layer: {
      show: true,
      state: '',
      content: ''
    }
  },

  onLoad: function (options) {

    var that = this
    mx = new mixin(this)
    mx.layer({})
    that.setData({
      authorid: options.authorid,
      author: options.author,
      avatar: options.avatar
    })
    wx.request({
        url: app.appUrl + 'author_post', //仅为示例，并非真实的接口地址
      data: {
        author: that.data.author
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        mx.close()
        that.setData({
          list: res.data.forum_list.data,
          next_page_url:res.data.forum_list.next_page_url,
          recordshow:false
        })
      }
    })
  },


  //向下分页
  loadMore: function () {
      var that = this
      wx.request({
          url: that.data.next_page_url,
          data: {
              author:that.data.author,
              unionid:wx.getStorageSync('unionid')
          },
          header: { 'Accept': 'application/json' },
          method: "GET",
          success: function (res) {
              if (that.data.next_page_url != res.data.next_page_url) {
                  that.setData({
                      list: that.data.list.concat(res.data.forum_list.data),
                      next_page_url: res.data.forum_list.next_page_url
                  })
              }
          }
      })
  },



  //关注作者请求
  addMyfollow_put: function (e) {
    var that = this
    wx.request({
      url: app.appUrl + 'myfollow_put', //仅为示例，并非真实的接口地址
      data: {
        authorid: that.data.authorid,
        unionid: getApp().globalData.unionid,
        author: that.data.author
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        wx.showToast({
          title: '关注该作者成功',
          icon: 'success',
          duration: 2000
        })
      }
    })
  }
})
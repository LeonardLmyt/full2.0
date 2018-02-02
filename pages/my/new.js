let app = getApp(),
  mixin = require('../../utils/mixin'),
  mx = null
Page({
  
  data: {
    list: [],
    next_page_url: 1,
    recordshow: true,
    windowHeight:0,
    layer: {
      show: true,
      state: '',
      content: ''
    }
  },
  onLoad: function (options) {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight
        });
      }
    })

    mx = new mixin(that)
    mx.layer({})
    //加载别人对我的贴子的评论
    wx.request({
      url: app.appUrl + 'postcomment', //仅为示例，并非真实的接口地址
      data: {
        unionid: wx.getStorageSync('unionid')
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log('xxxxxxxxxxxxxxxxxxxx')
        console.log(res)
        mx.close()
        that.setData({
          list: res.data.list_data,
          next_page_url: res.data.next_page,
          recordshow: false
        })
      }

    })
  },



  //向下分页
  loadMore: function () {
    var that = this
    console.log("pppppppppppp")
    console.log(that.data.next_page_url)
    console.log("pppppppppppp")
    wx.request({
      url: app.appUrl + 'postcomment',
      data: {
        author: that.data.author,
        unionid: wx.getStorageSync('unionid'),
        page: that.data.next_page_url + 1,
      },
      header: { 'Accept': 'application/json' },
      method: "GET",
      success: function (res) {
        console.log("tttttttttt")
        console.log(res)
        if (that.data.next_page_url != res.data.next_page) {
          that.setData({
            list: that.data.list.concat(res.data.list_data),
            next_page_url: res.data.next_page
          })
        }
      }
    })
  },

  //加载更多的评论
  more: function (e) {
    console.log("kkkkkkkkkkkkkk")
    console.log(e.currentTarget.dataset)
    console.log("kkkkkkkkkkkkkk")
    wx.request({
      url: that.data.next_page_url,
      data: {
        author: that.data.author,
        unionid: wx.getStorageSync('unionid')
      },
      header: { 'Accept': 'application/json' },
      method: "GET",
      success: function (res) {
        console.log("tttttttttt")
        console.log(res)
        if (that.data.next_page_url != res.data.postList.next_page_url) {
          that.setData({
            list: that.data.list.concat(res.data.postList.data),
            next_page_url: res.data.postList.next_page_url
          })
        }
      }
    })
  }

})
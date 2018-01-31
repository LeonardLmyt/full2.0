let app = getApp(),
  mixin = require('../../utils/mixin'),
  mx = null
Page({
  data: {
      next_page_url:'',
      record:[],
      recordshow:true,
      windowHeight:0,
      layer: {
        show: true,
        state: '',
        content: ''
      }
  },
  onLoad: function (options) {
    let that = this
    mx = new mixin(that)
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight
        });
      }
    })
    that._loadData()
  },
  _loadData: function () {
    mx.layer({})
    var that = this;
    var uid = wx.getStorageSync('unionid');
    wx.request({
      url: app.appUrl + "myPost?unionid=" + uid,
      method: "GET",
      header: { 'Accept': 'application/json' },
      success: function (res) {
        mx.close()
        that.setData({
          record: !res.data.myList.data ? [] : res.data.myList.data,
          next_page_url:res.data.myList.next_page_url,
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
              author: that.data.author,
              unionid: wx.getStorageSync('unionid')
          },
          header: { 'Accept': 'application/json' },
          method: "GET",
          success: function (res) {
              if (that.data.next_page_url != res.data.myList.next_page_url) {
                  that.setData({
                      record: that.data.record.concat(res.data.myList.data),
                      next_page_url: res.data.myList.next_page_url
                  })
              }
          }
      })
  },
})
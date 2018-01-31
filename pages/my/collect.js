let app = getApp(),
  mixin = require('../../utils/mixin'),
  mx = null

Page({
  data: {
    myfavorite: [],
    id: '',
    next_page_url: '',
    windowHeight:0,
    unionid: wx.getStorageSync('unionid'),
    recordshow:true,
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
    this._loadData();
  },
  _loadData: function () {
    var that = this;
    var uid = wx.getStorageSync('unionid');
    wx.request({
      url: app.appUrl + "myFavorite?unionid=" + uid,
      method: "GET",
      header: { 'Accept': 'application/json' },
      success: function (res) {
        that.setData({
          myfavorite: res.data.myFavorite.data,
          next_page_url: res.data.myFavorite.next_page_url,
          recordshow:false
        })
      }
    })
  },
  onReachBottom: function () {
    var that = this

    wx.request({
      url: that.data.next_page_url,
      data: { unionid: wx.getStorageSync('unionid') },
      header: { 'Accept': 'application/json' },
      method: "GET",
      success: function (res) {
        console.log(res)
        if (res.data.myFavorite.next_page_url != that.data.next_page_url) {
          that.setData({
            myfavorite: that.data.myfavorite.concat(res.data.myFavorite.data),
            next_page_url: res.data.myFavorite.next_page_url
          })
        }
      }
    })
  }
})
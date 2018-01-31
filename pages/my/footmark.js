var app = getApp()
// pages/my/footmark.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        footprint: [],
        id: '',
        next_page_url: '',
        unionid: wx.getStorageSync('unionid')
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this
        this._loadData();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    _loadData: function () {
        var that = this;
        var uid = wx.getStorageSync('unionid');
        wx.request({
            url: app.appUrl + "myFootprint?unionid=" + uid,
            method: "GET",
            header: { 'Accept': 'application/json' },
            success: function (res) {
                that.setData({
                    footprint: res.data.myFootprint.data,
                    next_page_url: res.data.myFootprint.next_page_url
                })
            }
        })
    },

    /**
  * 小程序自带函数 分页滚动
  */
    onReachBottom: function () {
        var that = this
        wx.request({
            url: that.data.next_page_url,
            data: { unionid: wx.getStorageSync('unionid') },
            header: { 'Accept': 'application/json' },
            method: "GET",
            success: function (res) {
                if (res.data.myFootprint.next_page_url != that.data.next_page_url) {
                    that.setData({
                        footprint: that.data.footprint.concat(res.data.myFootprint.data),
                        next_page_url: res.data.myFootprint.next_page_url
                    })
                }
            }
        })
    },

})
let mixin = require("../../utils/mixin"),
    app = getApp(),
    mx = null
Page({
    data: {
        layer: {
            show: true,
            state: '',
            content: ''
        },
        name: '',
        tid: 0,
        fid: 0,
        message: '',
        unionid:''
    },
    onLoad: function (options) {
        let t = this
        //var unid = wx.getStorageSync("unionid") 
        mx = new mixin(t)
        t.setData({
            name: options.name,
            tid: options.tid,
            fid: options.fid
        })
    },//回复贴子
    onShow:function(){
        let t = this

        t.setData({
            unionid: wx.getStorageSync('unionid')
        })
    },
    bindForum: function (e) {
        mx.layer({ content: '回帖中...' })
        var that = this,
            params = {
                tid: this.data.tid,
                message: this.data.message
            }
        wx.request({
            url: app.appUrl + 'userReply',
            data: {
                unionid: that.data.unionid,
                tid: that.data.tid,
                fid: that.data.fid,
                message: that.data.message
            },
            success: function (res) {
                if (res.data.data == true) {
                    mx.close()
                    wx.showToast({
                        title: res.data.error,
                        icon: 'success',
                        duration: 2000,
                        success: function () {
                            wx.setStorageSync('message', that.data.message)
                            wx.navigateBack({})
                        }
                    })
                } else {
                    wx.showToast({
                        title: res.data.error,
                        icon: 'success',
                        duration: 2000
                    })
                }
            },
            fail: function (error) {

            }
        })
    },
    addMessage: function (e) {
        this.setData({
            message: e.detail.value
        })
    }
})
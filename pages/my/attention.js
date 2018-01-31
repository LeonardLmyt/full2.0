var app = getApp()
// pages/bbs/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        navList: [],
        currentTopItem: 0,
        swiperHeight: 0,
        hotDataList: [],
        hallDataList: [],
        aaDataList: [],
        travelDataList: [],
        photographDataList: [],
        equipmentDataList: [],
        ridingDataList: [],
        mountainDataList: [],
        climbingDataList: [],
        topTabItems: [{ "name": '我关注的人', 'key': 'myfollow' }, { "name": '关注我的人', 'key': 'userfollow' }],
        attention_l: [],
        attention_r: [],
        isFreshing: false,
        isToLowerVersion: false,
    },
    onLoad: function (options) {
        var that = this;
        this._loadData('myfollow');
    },


    onReady: function () {
        var that = this;
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    swiperHeight: res.windowHeight - (res.windowWidth / 750 * 82),
                });
            }
        })

    },
    switchTab: function (e) {

        this.setData({
            currentTopItem: e.currentTarget.dataset.id
        });

        this._loadData(e.currentTarget.dataset.key)
    },
    _loadData: function (key) {
        var that = this;
        var uid = wx.getStorageSync('unionid');
        wx.request({
            url: app.appUrl + key + "?unionid=" + uid,
            method: "GET",
            header: { 'Accept': 'application/json' },
            success: function (res) {
                console.log("wwwwwwwwwww")
                console.log(res)
                if (key === 'myfollow') {
                    that.setData({
                        attention_l: res.data.myfollow.data
                    })
                } else {
                    that.setData({
                        attention_r: res.data.userfollow.data
                    })
                }
            }
        })
    },

    // 取消关注用户
    attention_tol: function (e) {
        var that = this
        var fwuid = e.currentTarget.dataset.fwuid
        var fwusername = e.currentTarget.dataset.fwusername
        var uid = e.currentTarget.dataset.uid
        var unionid = wx.getStorageSync('unionid');

        wx.request({
            url: app.appUrl + 'userfollow_del', //仅为示例，并非真实的接口地址
            data: {
                fwuid: fwuid,
                unionid: unionid,
                fwusername: fwusername,
                uid: uid,
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (res) {
                wx.showToast({
                    title: '已取消关注',
                    icon: 'success',
                    duration: 2000
                })
            }
        })
    },

    // 关注用户
    attention_tor: function (e) {
        var that = this
        var fwuid = e.currentTarget.dataset.fwuid
        var fwusername = e.currentTarget.dataset.fwusername
        var uid = e.currentTarget.dataset.uid
        var unionid = wx.getStorageSync('unionid');

        wx.request({
            url: app.appUrl + 'myfollow_put', //仅为示例，并非真实的接口地址
            data: {
                authorid: fwuid,
                unionid: unionid,
                author: fwusername,
                uid: uid,
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (res) {
                wx.showToast({
                    title: '已成功关注',
                    icon: 'success',
                    duration: 2000
                })
            }
        })
    }

})
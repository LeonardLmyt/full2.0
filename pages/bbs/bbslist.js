var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {

        swiperHeight: 0,
        topTabItems: [],
        forum_data: [],
        tid: '',
        next_page_url: '',
        unionid: '',
        fid: "",
        windowHeight: 0,
        name:'',
        pagecache: [],
    },

    onLoad: function (e) {
        console.log("eeeeeeeeeeeeeee")
        console.log(e)
        var that = this
        that.setData({
            fid: e.fid,
            name:e.name
        })
        wx.request({
            url: app.appUrl + "forum_list2/" + that.data.fid,
            method: "GET",
            header: { 'Accept': 'application/json' },
            success: function (res) {
                console.log("eeeeeeeeeeeeeee")
                console.log(res)
                that.setData({
                    forum_data: res.data.forum_list.data,
                    next_page_url: res.data.forum_list.next_page_url
                })
                if (res.data.forum_list.data.length === 0) {
                    that.data.pagecache = true
                    that.setData({
                        pagecache: that.data.pagecache
                    })
                }

            }
        })
    },


    onShow: function (options) {

    },



    goTop: function () { //回到顶部
        let that = this;
        that.data.scrollTop[that.data.currentTopItem] = 0
        this.setData({
            scrollTop: that.data.scrollTop
        })
    },



    loadMore: function (e) { //滚动加载更多
        var that = this
        wx.request({
            url: that.data.next_page_url,
            method: "GET",
            header: { 'Accept': 'application/json' },
            success: function (res) {
                if (res.data.forum_list.next_page_url !== that.data.next_page_url) {
                    console.log("uuuuuuuu")
                    console.log(res)
                    that.data.forum_data.push(...res.data.forum_list.data)
                    that.setData({
                        forum_data: that.data.forum_data,
                        next_page_url: res.data.forum_list.next_page_url,
                    })
                    console.log(that.data.forum_data)
                }
                if (res.data.forum_list.data.length === 0) {
                    that.data.pagecache = true
                    that.setData({
                        pagecache: that.data.pagecache
                    })
                }
            }
        })
    },


})
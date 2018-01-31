let app = getApp();
Page({
    data: {
        id: null,
        img: null,
        name: null,
        url: null,
        view: null,
        video_List: [],
        nickk: "",
        next_page_url:'',
        height: 0,
        goTop: {
          show: false,
          locking: false
        },
        scrolltop: 0
    },
    onLoad: function (options) {
        var that = this;
        wx.request({
            //url:"http://localhost/ds/index.php/home/video/test",
            url: app.appUrl+"videoList",
            data: {
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (res) {
                console.log("ssssssss")
                that.setData({
                    video_List: res.data.videoList.data,
                    next_page_url:res.data.videoList.next_page_url
                })
            }
        })

        wx.getSystemInfo({
          success: function (res) {
            that.setData({
              height: res.windowHeight - 50
            });
          }
        })
    },
    //向下分页
    loadMore: function () {
        var that = this
        wx.request({
            url: that.data.next_page_url,
            data: {},
            header: { 'Accept': 'application/json' },
            method: "GET",
            success: function (res) {
                if (that.data.next_page_url != res.data.videoList.next_page_url) {
                    that.setData({
                        video_List: that.data.video_List.concat(res.data.videoList.data),
                        next_page_url: res.data.videoList.next_page_url
                    })
                }
            }
        })
    },
    scroll: function (e) {
      let that = this
      that.ani(e)
    },
    ani: function (e) {
      let that = this
      if (that.data.scrolltop > e.detail.scrollTop) {
        if (!that.data.goTop.show) {
          that.data.goTop.show = true
          that.data.goTop.locking = true
        } else {
          that.data.goTop.show = false
          that.data.goTop.locking = true
        }
      } else {
        that.data.goTop.locking = false
      }
      that.setData({
        goTop: that.data.goTop
      })
      that.data.scrolltop = e.detail.scrollTop
    },
    goTop: function () {
      this.setData({
        scrolltop: 0
      })
    },
    onShareAppMessage: function () {
      return {
        title: '8848社区精彩视频',
        desc: '最新驴友原创精华热点好帖子推荐，不可错过',
        path: '/pages/video/video?from=userAndGroupShare'
      }
    }
})
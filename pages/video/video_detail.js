let app = getApp(),
  time = null,
  mixin = require("../../utils/mixin"),
  mx = null

Page({
  data: {
    id: "",
    intro: '',
    name: '',
    url: "",
    view: '',
    unionid: '',
    fid: '',
    comment: "",
    risk: '户外有风险，仅供参考',
    all_comments: '全部评论',
    message: '',
    postNum: '',
    commentnum: 1000,
    collectionnum: 9,
    forwardnum: 5,
    collectionSrc: {
      show: false,
      true: '/images/icon_comment_collection_sel.png',
      false: '/images/icon_comment_collection.png',
      collection: false
    },
    message: '',
    height: 0,
    goTop: {
      show: false,
      locking: false
    },
    scrolltop: 0,
    layer: {
      show: true,
      state: '',
      content: ''
    },
    toView:''
  },
  onLoad: function (options) {
    var that = this
    mx = new mixin(that)
    this.setData({
      id: options.id,
      name: options.name,
      url: options.url,
      view: options.view,
      intro: options.intro,
      createtime: options.createtime
    })
    that.setData({
      unionid: wx.getStorageSync('unionid')
    })
    //获得视频的评论
    wx.request({
      url: app.appUrl + 'videoComments_get',
      data: {
        video_id: that.data.id,
        unionid: wx.getStorageSync('unionid')
      },

      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log("oooooo")
        console.log(res)
        try {
          if (res.data.error == "暂时没人评论！") {
              console.log("hhhhhhhhhhhhhh")
            that.setData({
              postNum: 0
            })
          } else {
              console.log("uuuuuuuuuuuuuuuuuuu")
            console.log(res.data)
            that.setData({
              comment: res.data.videoComments_get.data,
              postNum: res.data.videoComments_get.data.length
            })
          }
        } catch (e) {
          console.log(e.message)
        }
      }
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.windowHeight
        });
      }
    })
    //判断是否收藏
    wx.request({
      url: app.appUrl + 'is_Favorite', //仅为示例，并非真实的接口地址
      data: {
        tid: options.id,
        unionid: wx.getStorageSync('unionid')
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.rult !== null) {
          that.data.collectionSrc.show = true
          that.setData({
            collectionSrc: that.data.collectionSrc
          })
        }
      }
    })


  },
  addMessage: function (e) {
    this.setData({
      message: e.detail.value
    })
  },
  //评论
  addPost: function (e) {
    let that = this
    mx.layer({ content: '回帖中...' })
    if (!e.detail.value.message.length) {
      mx.layer({ content: '请输入发表内容', state: 'layer-error', time: 2 })
      return false
    }
    let promise = new Promise(function (resolve, reject) {
      wx.request({
        url: app.appUrl + 'user_is_bind',
        data: {
          unionid: wx.getStorageSync('unionid')
        },
        method: 'GET',
        success: function (res) {
          if (res.data.sult) {
            resolve(res)
          } else {
            reject(res)
          }
        }
      })
    })

    promise.then(function (res) {
      that.replyPost(e)
    }, function (res) {
      mx.layer({ content: res.data.error, state: 'layer-error', time: 2 })
      setTimeout(function () {
        wx.navigateTo({
          url: '/pages/my/my'
        })
      }, 2000)
    })

  },
  replyPost:function(e){
    let that = this
    return new Promise(function(resolve,reject){
      wx.request({
        url: app.appUrl + "videoComments_put", //仅为示例，并非真实的接口地址
        data: {
          video_id: that.data.id,
          contents: that.data.message,
          unionid: wx.getStorageSync('unionid'),
        },
        success: function (res) {
          mx.close()
          if (res) {
            let post = {}
            /*shuju*/
            post['contents'] = that.data.message
            post['avatarurl'] = wx.getStorageSync('avatarurl')
            post['nickname'] = wx.getStorageSync('nickname')
            post['time'] = "刚刚"

            that.data.comment.splice(0, 0, post)

            wx.showToast({
              title: '已发布评论！',
              duration: 2000
            });
          }
          that.setData({
            message: '',
            isReply: false,
            comment: that.data.comment,
            toView: 'id0'
          })
        }
      })
    })
  },
  //收藏
  addCollection: function (e) {
    var that = this
    //判断是否收藏，没有就添加收藏，有收藏的就执行删除
    if (that.data.collectionSrc.show == false) {
      console.log("yyyyyyyyyyyyyyyyyyyyyyyyy")
      wx.request({
        url: app.appUrl + 'myFavorite_put', //仅为示例，并非真实的接口地址
        data: {
          tid: that.data.id,
          unionid: wx.getStorageSync('unionid'),
          fid: 'video',
          name: that.data.name,
          is_mark: 1
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log(res)
          if (res) {
            that.data.collectionSrc.show = true
            that.data.collectionSrc.collection = true
            that.setData({
              collectionSrc: that.data.collectionSrc
            })
            let collectionTime = setTimeout(function () {
              that.data.collectionSrc.collection = false
              that.setData({
                collectionSrc: that.data.collectionSrc
              })
              clearTimeout(collectionTime)
            }, 2000);
          }
        }
      })
    } else {
      console.log("yyyyyyyyyyyyyyyyyyyyyyyyy")
      wx.request({
        url: app.appUrl + 'del_myFavorite', //仅为示例，并非真实的接口地址
        data: {
          tid: that.data.id,
          unionid: wx.getStorageSync('unionid'),
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          if (res.data) {
            wx.showToast({
              title: '已删除了收藏！',
              duration: 2000
            });
            that.data.collectionSrc.show = false
            that.setData({
              collectionSrc: that.data.collectionSrc
            })
          }
        }
      })
    }
  },

  //分享
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: this.data.name,
      path: '/pages/video/video_detail?id=' + this.data.id + '&name=' + this.data.name + '&url=' + this.data.url + '&view=' + this.data.view + '&intro=' + this.data.intro + '&createtime=' + this.data.createtime,

      success: function (res) {
        // 转发成功
        if (res) {
          wx.showToast({
            title: '分享成功！',
            duration: 2000
          });
        }
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  switchInput: function (e) {
    this.setData({
      isReply: true,
      replyFocus: true
    })
  },
  addMessage: function (e) {
    this.setData({
      message: e.detail.value,
      isReply: false,
      replyFocus: false
    })
  },
  scroll: function (e) {
    let that = this
    that.ani(e)
    that.data.scrolltop = e.detail.scrollTop
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
  }

})
let util = require("../../utils/util"),
  db = require("../../utils/db"),
  app = getApp(),
  mixin = require("../../utils/mixin"),
  mx = null,
  unionid = wx.getStorageSync('unionid')

Page({
  data: {
    postList: [],
    threadList: {},
    page: 1,
    tid: 0,
    fid: '',
    isLoading: false,
    hasMore: false,
    bindScrollShow: true,
    height: 0,
    cacheTop: 0,
    collectionSrc: {
      show: false,
      true: '/images/icon_comment_collection_sel.png',
      false: '/images/icon_comment_collection.png',
      collection: false,
      post_tow: true
    },
    message: '',
    toView: '',
    replies: '',
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
    isReply: false,
    replyFocus: false
  },
  onLoad: function (options) {
    let that = this
    that.data.tid = options.tid;
    that.getContentByTid(options)
  },
  onShow: function () {
    let that = this
    mx = new mixin(that)
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
        tid: this.data.tid,
        unionid: unionid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (!!res.data.rult) {
          that.data.collectionSrc.show = true
          that.setData({
            collectionSrc: that.data.collectionSrc
          })
        }
      }
    })
  },
  getContentByTid: function (options) {
    var that = this,
      thread,
      details,
      pager,
      params = {
        page: that.data.page,
        tid: options.tid,
      };

    util.showLoading();

    db.getContent((res, error) => {
      thread = res.data.thread;
      details = res.data.postList;
      pager = res.data.pager;

      if (res.statusCode !== 200) return;
      util.hideLoading();

      wx.setNavigationBarTitle({ title: thread.subject });
      for (let item in details) {
        console.log('mmmmmmmmmmmmmmm')
        console.log(details[item])
        details[item].message = details[item].message.replace(/^(<br \/>|<br\/>)*/, '')
        details[item].dateline = details[item].dateline.replace(/20\d{2}-/, '')
      }
      that.setData({
        isReady: !that.data.isReady,
        threadList: thread,
        replies: thread.replies,
        fid: res.data.thread.fid,
        postList: details,
        page: pager.nextPage,
        isLoading: pager.nextPage == pager.pageCnt ? false : true,
        hasMore: pager.nextPage == pager.pageCnt ? false : true,
      });

    }, params)
  },
  ReachBottom: function () {
    var that = this,
      tid = that.data.tid,
      page = that.data.page,
      params = {
        page: page,
        tid: tid,
      };

    if (that.data.isLoading) {
      util.showLoading();
      db.getContent((res, error) => {
        if (res.statusCode !== 200) return;
        for (let item in res.data.postList) {
          res.data.postList[item].message = res.data.postList[item].message.replace(/^(<br \/>|<br\/>)*/, '')
          res.data.postList[item].dateline = res.data.postList[item].dateline.replace(/20\d{2}-/, '')
        }
        util.hideLoading();
        that.setData({
          postList: Object.assign(that.data.postList, res.data.postList),
          page: res.data.pager.nextPage,
          isLoading: page == res.data.pager.nextPage ? false : true,
        });
      }, params);
    } else {
      that.setData({
        hasMore: false,
      })
    }
  },
  onShareAppMessage: function () {
    return {
      title: this.data.threadList.subject,
      path: '/pages/detail/detail?tid=' + this.data.tid,
    }
  },
  onShareAppMessage: function () {
    return {
      title: this.data.threadList.subject,
      path: '/pages/detail/detail?tid=' + this.data.tid,
    }
  },
  //收藏
  addCollection: function (e) {
    var that = this
    //判断是否收藏，没有就添加收藏，有收藏的就执行删除
    if (that.data.collectionSrc.show == false) {
      wx.request({
        url: app.appUrl + 'myFavorite_put', //仅为示例，并非真实的接口地址
        data: {
          tid: that.data.tid,
          unionid: unionid,
          subject: that.data.threadList.subject,
          fid: that.data.fid,
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          if (res.data.data) {
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
      wx.request({
        url: app.appUrl + 'del_myFavorite', //仅为示例，并非真实的接口地址
        data: {
          tid: that.data.tid,
          unionid: unionid,
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
  addPost: function (e) {
    let t = this
    mx.layer({ content: '回帖中...' })
    if (!e.detail.value.message.length) {
      mx.layer({ content: '请输入发表内容', state: 'layer-error', time: 2 })
      return false
    }
    let promise = new Promise(function (resolve, reject) {
      wx.request({
        url: app.appUrl + 'user_is_bind',
        data: {
          unionid: unionid
        },
        method: 'GET',
        success: function (res) {
          if (res.data.sult){
            resolve(res)
          }else{
            reject(res)
          }
        }
      })
    })

    promise.then(function(res){
      t.replyPost(e)
    }, function (res){
      mx.layer({ content: res.data.error, state:'layer-error',time:2})
      setTimeout(function(){
        wx.navigateTo({
          url: '/pages/my/my'
        })
      },2000)
    })
  },
  replyPost: function (e) {
    let that = this
    return new Promise(function (resolve, reject) {
        let params = {
          tid: that.data.tid,
          message: e.detail.value.message
        }
      wx.request({
        url: app.appUrl + 'userReply',
        data: {
          unionid: unionid,
          tid: that.data.tid,
          fid: that.data.fid,
          message: params.message
        },
        success: function (res) {
          if (res.data.data == true) {
            mx.close()
            let first = null,
              post = {},
              all = {},
              add = Math.floor(Math.random() * 1000000 + (100000 - 99999))
            for (let item of (Object.keys(that.data.postList)).keys()) {
              if (item === 0) {
                first = that.data.postList[Object.keys(that.data.postList)[item]]
                delete that.data.postList[Object.keys(that.data.postList)[item]]
                break;
              }
            }
            /*shuju*/
            post['message'] = e.detail.value.message;
            post['avatar'] = wx.getStorageSync('avatarurl');
            post['author'] = wx.getStorageSync('nickname');
            post['dateline'] = "刚刚";
            all = { [Math.floor(Math.random() * 100000 + (10000 - 9999))]: first };
            Object.assign(all, { [add]: post }, that.data.postList)
            var replies_num = parseInt(that.data.replies);
            that.setData({
              postList: all,
              toView: 'id' + [add],
              isReply: false,
              message: ''
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
    })
  }
});
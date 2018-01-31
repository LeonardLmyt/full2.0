const app = getApp()
const util = require("../../utils/util")
//let unionid = wx.getStorageSync('unionid')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperHeight: 0,
    currentTab: 0,
    topTabItems: [],
    isToLowerVersion: false,
    forum_data: [],
    tid: '',
    next_page_url: '',
    fid: "",
    scrollTop: [],
    pagecache: [],
    getAddStatus: true,
    goTop: {
      show: false,
      locking: false
    },
    windowHeight: 0,
    loading: {
      scrolltop: 0,
      s_y: 0
    }
  },
  onLoad:function(){
    let that = this
    if (that.data.fid === "") {
      wx.request({
        url: app.appUrl + "forum_list",
        data: {
          unionid: wx.getStorageSync('unionid'),
        },
        method: "GET",
        header: { 'Accept': 'application/json' },
        success: function (res) {
          let scrollTop = [],
            pagecache = [],
            forum_data = [];
          res.data.top_list.forEach(function () {
            scrollTop.push(0)
            pagecache.push({ load: false, num: 1, loadover: false })
            forum_data.push([])
          })
          that.setData({
            topTabItems: res.data.top_list,
            scrollTop: scrollTop,
            pagecache: pagecache,
            forum_data: forum_data
          })
          that.getList(res.data.top_list[0].fid, 1, false) //初始化加载数据
        }
      })
    }
  },
  onShow: function (options) {
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          swiperHeight: res.windowHeight - (res.windowWidth / 750 * 100),
          windowHeight: res.windowHeight
        });
      }
    })
  },
  tabFun: function (e) {
    var that = this,
    num = e.currentTarget.dataset.id
    if (this.data.currentTab === e.target.dataset.current) {
      that.setData({
        actType: e.target.dataset.acttype,
      })
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
      this.getList(e.currentTarget.dataset.fid, that.data.pagecache[num].num, that.data.pagecache[num].loadover)
    }
  },
  switchTab: function (e) {
    var that = this,
      num = e.currentTarget.dataset.id
    that.setData({
      currentTab: e.currentTarget.dataset.id
    });

    that.getList(e.currentTarget.dataset.fid, that.data.pagecache[num].num, that.data.pagecache[num].loadover)
  },
  bindChange: function (e) {
    var that = this,
      num = e.currentTarget.dataset.id
    that.setData({
      currentTab: e.detail.current
    })
  },
  getList: function (fid, page, loadover) { //加载数据
    var that = this
    if (that.data.getAddStatus) {
      that.setData({
        getAddStatus: false
      })
      wx.request({
        url: app.appUrl + "forum_list2/" + fid + "?page=" + page,
        method: "GET",
        header: { 'Accept': 'application/json' },
        success: function (res) {
            console.log("rrrrrrrr")
            console.log(res)
          let num = that.data.currentTab
          that.data.pagecache[num].num += 1
          that.data.forum_data[num].push(...res.data.forum_list.data)
          that.setData({
            forum_data: that.data.forum_data,
            next_page_url: res.data.next_page_url,
            pagecache: that.data.pagecache,
            getAddStatus: true
          })
          if (res.data.forum_list.data.length === 0) {
            that.data.pagecache[num].loadover = true
            that.setData({
              pagecache: that.data.pagecache
            })
          }
        }
      })
    }
  },
  goTop: function () { //回到顶部
    let that = this;
    that.data.scrollTop[that.data.currentTab] = 0
    this.setData({
      scrollTop: that.data.scrollTop
    })
  },
  loadMore: function (e) { //滚动加载更多
    var that = this,
      num = that.data.currentTab
    that.getList(e.currentTarget.dataset.fid, that.data.pagecache[num].num, that.data.pagecache[num].loadover)
  },
  scroll: function (e) {
    let that = this
    setTimeout(function () { that.ani(e)},0)
  },
  ani: function (e) {
    let that = this
    if (that.data.loading.scrolltop > e.detail.scrollTop) {
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
    that.data.loading.scrolltop = e.detail.scrollTop
  },
  touchstart: function (e) {
    let that = this
    that.data.loading.s_y = e.changedTouches[0].pageY
  },
  touchend: function (e) {
    let that = this
    if (e.changedTouches[0].pageY - that.data.loading.s_y > 150 && !that.data.loading.scrolltop) {
      util.showLoading();//加载新数据，乱序，无浏览过的数据
      console.log('分类id' + e.currentTarget.dataset.fid)
    }
  }
})
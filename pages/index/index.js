const app = getApp();
const util = require("../../utils/util");
const db = require("../../utils/db");
const wc = require("../../utils/wcache")
const types = ["0", "12", "161", "52", "39", "7", "88", "24", "135"];
let page = 1;
const DATATYPE = {
  HOTDATATYPE: "0",
  HALLDATATYPE: "12",
  AADATATYPE: "161",
  TRAVELDATATYPE: "52",
  PHOTOGRAPHDATATYPE: "39",
  EQUIPMENTDATATYPE: "7",
  RIDINGDATATYPE: "88",
  MOUNTAINDATATYPE: "24",
  CLIMBINGDATATYPE: "135",
}

Page({

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
    topTabItems: ["热帖", "大厅", "约伴", "游记", "摄影", "装备", "骑行", "登山", "攀岩"],
    isFreshing: false,
    isToLowerVersion: false,
    scrolltop: 0,
    loading: {
      scrolltop: 0,
      s_y: 0

    },
    goTop: {
      show: false,
      locking: false
    }
  },
  onLoad: function () { 
    let that = this 
    if (wc.get('allData')) {
      that.setData({
        hotDataList: wc.get('allData')      
      });
      that.getRecommend('up');
      console.dir('aaaaaaaaaa',wc.get('allData'))
      return;
    }

    if (app.globalData.isToLowerVersion) {
      this.setData({
        isToLowerVersion: app.globalData.isToLowerVersion
      });
      return;
    }
    this.refreshNewData();
  },
  onShow: function () {
  },
  onReady: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          swiperHeight: res.windowHeight - 50
        });
      }
    })
  },
  refreshNewData: function () {
    var that = this,
      params = {
        fid: types[that.data.currentTopItem]
      };
    util.showLoading();
    if (types[that.data.currentTopItem] == 0) {
      db.getHotList((res, err) => {
        if (res.statusCode !== 200) return;

        if (res.data.error) {
          util.hideLoading();
          return;
        } else {
          util.hideLoading();
          page = 1;
          that.setNewDataWithRes(res, that);
        }
      }, page)
    } else {
      db.getBBSList((res, err) => {
        if (res.statusCode !== 200) return;
        util.hideLoading();
        page = 1;
        that.setNewDataWithRes(res, that);
      }, params)
    }
  },
  setNewDataWithRes: function (res, target) {
    switch (types[this.data.currentTopItem]) {
      case DATATYPE.HOTDATATYPE:
        target.setData({
          hotDataList: res.data
        });
        break;
      case DATATYPE.HALLDATATYPE:
        target.setData({
          hallDataList: res.data.forum.forum_mainlist
        });
        break;
      case DATATYPE.AADATATYPE:
        target.setData({
          aaDataList: res.data.forum.forum_mainlist
        });
        break;
      case DATATYPE.TRAVELDATATYPE:
        target.setData({
          travelDataList: res.data.forum.forum_mainlist
        });
        break;
      case DATATYPE.PHOTOGRAPHDATATYPE:
        target.setData({
          photographDataList: res.data.forum.forum_mainlist
        });
        break;
      case DATATYPE.EQUIPMENTDATATYPE:
        target.setData({
          equipmentDataList: res.data.forum.forum_mainlist
        });
        break;
      case DATATYPE.RIDINGDATATYPE:
        target.setData({
          ridingDataList: res.data.forum.forum_mainlist
        });
        break;
      case DATATYPE.MOUNTAINDATATYPE:
        target.setData({
          mountainDataList: res.data.forum.forum_mainlist
        });
        break;
      case DATATYPE.CLIMBINGDATATYPE:
        target.setData({
          climbingDataList: res.data.forum.forum_mainlist
        });
        break;
      default:
        break;
    }
  },
  setMoreDataWithRes: function (res, target) {
    switch (types[this.data.currentTopItem]) {
      case DATATYPE.HOTDATATYPE:
        target.setData({
          hotDataList: target.data.hotDataList.concat(res.data),
          isFreshing: false,
        });
        break;
      case DATATYPE.HALLDATATYPE:
        target.setData({
          hallDataList: target.data.hallDataList.concat(res.data.forum.forum_mainlist),
          isFreshing: false,
        });
        break;
      case DATATYPE.AADATATYPE:
        target.setData({
          aaDataList: target.data.aaDataList.concat(res.data.forum.forum_mainlist),
          isFreshing: false,
        });
        break;
      case DATATYPE.TRAVELDATATYPE:
        target.setData({
          travelDataList: target.data.travelDataList.concat(res.data.forum.forum_mainlist),
          isFreshing: false,
        });
        break;
      case DATATYPE.PHOTOGRAPHDATATYPE:
        target.setData({
          photographDataList: target.data.photographDataList.concat(res.data.forum.forum_mainlist),
          isFreshing: false,
        });
        break;
      case DATATYPE.EQUIPMENTDATATYPE:
        target.setData({
          equipmentDataList: target.data.equipmentDataList.concat(res.data.forum.forum_mainlist),
          isFreshing: false,
        });
        break;
      case DATATYPE.RIDINGDATATYPE:
        target.setData({
          ridingDataList: target.data.ridingDataList.concat(res.data.forum.forum_mainlist),
          isFreshing: false,
        });
        break;
      case DATATYPE.MOUNTAINDATATYPE:
        target.setData({
          mountainDataList: target.data.mountainDataList.concat(res.data.forum.forum_mainlist),
          isFreshing: false,
        });
        break;
      case DATATYPE.CLIMBINGDATATYPE:
        target.setData({
          climbingDataList: target.data.climbingDataList.concat(res.data.forum.forum_mainlist),
          isFreshing: false,
        });
        break;
      default:
        break;
    }
  },
  loadMoreData: function (e) {
    var that = this,
      params = {
        page: page + 1,
        fid: types[this.data.currentTopItem],
      };
    util.showLoading();
    if (that.data.isFreshing) return;

    that.setData({
      isFreshing: true,
    });

    if (types[that.data.currentTopItem] == 0) {
      db.getHotList((res, err) => {
        if (res.statusCode !== 200) return;
        if (res.data.error) {
          that.setData({isFreshing: false})
          that.getRecommend('down')
          util.hideLoading();
          return;
        } else {
          util.hideLoading();
          page += 1;
          that.setMoreDataWithRes(res, that);
        }
      }, page + 1)
    } else {
      db.getBBSList((res, err) => {
        if (res.statusCode !== 200) return;
        util.hideLoading();
        page += 1;
        that.setMoreDataWithRes(res, that);
      }, params)
    }
  },
  onShareAppMessage: function () {
    return {
      title: '8848社区',
      desc: '最新驴友原创精华热点好帖子推荐，不可错过',
      path: '/pages/index/index?from=userAndGroupShare'
    }
  },
  scroll: function (e) {
    let that = this
    that.ani(e)
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
  goTop: function () { //回到顶部
    let that = this;
    that.data.loading.scrolltop = -1
    this.setData({
      loading: that.data.loading
    })
  },
  touchstart: function (e) {
    let that = this
    if (!that.data.loading.scrolltop) {
      that.data.loading.s_y = e.changedTouches[0].pageY
    }

  },
  touchend: function (e) {
    let that = this
    if (e.changedTouches[0].pageY - that.data.loading.s_y > 150) {
      util.showLoading();//加载新数据，乱序，无浏览过的数据
      that.getRecommend('up')
    }

  },
  onPullDownRefresh: function (e) {
    console.log("sssssssssssss");
    //wx.startPullDownRefresh();
  },
  getRecommend:function(keep){
    if(!wx.getStorageSync('unionid')){
      return;
    }
    let that = this
    wx.request({
      url: app.appUrl + 'get_recommend', //仅为示例，并非真实的接口地址
      data: {
        unionid: wx.getStorageSync('unionid'),
        home: app.globalData.home,
        tids: !!wx.getStorageSync('tids') ? wx.getStorageSync('tids') : '',
        page: !!wx.getStorageSync('downTimes') ? wx.getStorageSync('downTimes') : 1,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        
        util.hideLoading();
        if (app.globalData.home) { //在首页 
          app.globalData.home = 0
        } else { //不在首页    
          app.globalData.home = 0
        }
        var sult = res.data
        console.log('22222222222222222',res.data)
        if (res.data) {
          if (keep === 'up') that.data.hotDataList.unshift(...sult)
          else that.data.hotDataList.push(...sult)
          that.setData({
            hotDataList: that.data.hotDataList
          })
          for(let item in sult){
            if(sult[item].ishot){
              wx.setStorageSync('tids', wx.getStorageSync('tids') + ',' + sult[item].tid) 
             }
          }
          wc.put('allData', that.data.hotDataList)
          wx.setStorageSync('downTimes', Number(!!wx.getStorageSync('downTimes') ? wx.getStorageSync('downTimes') : 1) + 1)
        }
      }
    })
  }
});


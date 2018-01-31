
let mixin = require('../../utils/mixin'),
  mx = null,
  app = getApp(),
  unionid = wx.getStorageSync('unionid'),
  adds = {};

Page({
  data: {
    title: '',
    titlefocus:false,
    message: '',
    messagefocus:false,
    messagenum:0,
    layer: {
      show: true,
      state: '',
      content: ''
    }
  },
  onReady: function () {
    let t = this,
      message = wx.getStorageSync('post_message')
    this.setData({
      title: wx.getStorageSync('post_title'),
      message: message,
      messagenum: message.length
    })
  },
  onShow: function () {
    let t = this
    mx = new mixin(t)
  },
  addTitle: function (res) {
    this.setData({
      title: res.detail.value
    })
    wx.setStorage({
      key: 'post_title',
      data: res.detail.value
    })
  },
  addMessage: function (res) {
    this.setData({
      message: res.detail.value,
      messagenum: res.detail.value.length
    })
    wx.setStorage({
      key: 'post_message',
      data: res.detail.value
    })
  },
  publish:function(){
    if (this.data.title.length < 2) {
      mx.layer({ content: '标题不能少于2个字', time: 2, state: 'layer-error' })
      return;
    }
    if (this.data.message.length < 10) {
      mx.layer({ content: '描述不能少于10个字', time: 2, state: 'layer-error' })
      return;
    }
    let t = this
    wx.request({
      url: app.appUrl + 'userPublish', //仅为示例，非真实的接口地址
      data: {
        unionid: unionid,
        title: t.data.title,
        description: t.data.message,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        //发帖成功后清除缓存:
        wx.removeStorageSync('post_message')
        wx.removeStorageSync('post_title')
        wx.removeStorageSync('post_data')
        //发帖成功的后续处理:
        mx.layer({ content: '发帖成功', time: 2 })
        setTimeout(function () {
          wx.navigateTo({
            url: '/pages/bbs/bbs', //跳转路径
          })
        }, 2000)
      }
    })
  },
  addImg:function(){
    if (this.data.title.length < 2){
      mx.layer({content:'标题不能少于2个字',time:2,state:'layer-error'})
      return;
    }
    if (this.data.message.length < 10) {
      mx.layer({ content: '描述不能少于10个字', time: 2, state: 'layer-error' })
      return;
    }
    wx.navigateTo({
      url: '/pages/cate/addImg',
    })
  }, 
  focus:function(e){
    let t = this,
      attr = e.currentTarget.dataset.attr
      if(attr === 'title'){
        t.setData({
          titlefocus:true
        })
      }else{
        t.setData({
          messagefocus: true
        })
      }
  },
  blur:function(e){
    let t = this,
      attr = e.currentTarget.dataset.attr
    if (attr === 'title') {
      t.setData({
        titlefocus: false
      })
    } else {
      t.setData({
        messagefocus: false
      })
    }
  }
})

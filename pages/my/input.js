// pages/my/input.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    username: '',
    nickname: '',
    error: false,
    name:'',
    up_ok:false
  },
  onLoad: function (options) {
    console.log("yyyyyyyyyy")
    console.log(options)
    var that = this;
    var phone = options.phone
    var name = options.username
    that.setData({
      phone: phone,
      nickname: name
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  formSubmit: function (e) {
    var that = this
    console.log("yyyyyyyyyyyyyyyy")
    console.log(e)
    wx.request({
      url: app.appUrl + 'is_only_username', //仅为示例，并非真实的接口地址
      data: {
        username: e.detail.value.username,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.sult) {
            wx.request({
                url: app.appUrl + 'newUserBind', //仅为示例，并非真实的接口地址
                data: {
                    phone: that.data.phone,
                    username: e.detail.value.username,
                    unionid: wx.getStorageSync('unionid')
                },
                header: {
                    'content-type': 'application/json' // 默认值
                },
                success: function (res) {
                    console.log("aaaaaaaaaaaaaaaaaaaaaaaaass")
                    console.log(res)
                    if (res.data.error == '新建用户绑定成功') {
                        wx.navigateTo({
                            url: 'my'
                        })
                        wx.showToast({
                            title: '用户绑定成功',
                            icon: 'success',
                            duration: 3000
                        })
                    }
                    if (res.data.error == '新建用户绑定失败') {
                        wx.showToast({
                            title: '用户绑定失败！',
                            icon: 'none',
                            duration: 3000
                        })
                    }
                }
            })
         

        } else {
            wx.showModal({
                title: '提示',
                showCancel: false,
                content: '这个用户名已经存在，请重新起个名字吧！',
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })
        }
      }
    })

  },
  addName: function (e) {
    let t = this
    if (e.detail.value.length > 0){
      t.setData({
        up_ok: true
      })
    }else{
      t.setData({
        up_ok: false
      })
    }
    t.setData({
      name: e.detail.value
    })
  }
})
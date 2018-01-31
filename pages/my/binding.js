var app = getApp();
Page({

  data: {
    validate: {
      change: 212, //确定位置，误差浮点 2
      left: 0,
      s_y: 0,
      show: true,
      success: false,
      phone:''

    },
    username: '',
    password: '',
    pass: {
      show: true,
      true: 'password',
      false: 'text'
    }
  },

onLoad:function(e){
    var that = this
console.log("uuuuuuuuuuuuuuu")
console.log(e)
that.setData({
    phone:e.phone
})
},

    validateStart: function (e) {
        console.log(e.touches[0].pageX)
        if (this.data.validate.success) return
        this.data.validate.s_y = e.touches[0].pageX
        this.data.validate.show = false
        this.setData({
            validate: this.data.validate
        })
    },

    validateMove: function (e) {
        console.log(e.touches[0].pageX)
        if (this.data.validate.success) return
        let that = this
        if (that.data.validate.left > -1) {
            that.data.validate.left = e.touches[0].pageX - that.data.validate.s_y
            wx.showToast({
                title: that.data.validate.left.toString(),
            })
            that.setData({
                validate: that.data.validate
            })
        }
    },

    validateEnd: function (e) {
        if (this.data.validate.success) return
        let that = this,
            dataset = e.currentTarget.dataset
        if ((dataset.changestart <= that.data.validate.left) && (that.data.validate.left <= dataset.changeend)) {
            wx.showToast({
                title: '验证成功',
            })
            setTimeout(function () {
                that.data.validate.show = true
                that.data.validate.success = true
                that.setData({
                    validate: that.data.validate
                })
            }, 500)
        } else {
            wx.showToast({
                title: '验证失败',
            })
            that.data.validate.s_y = 0 //复位
            that.data.validate.left = 0
            that.setData({
                validate: that.data.validate
            })
        }
    },

    formSubmit: function (e) {
        var that = this
        console.log(e);
        console.log("aaaaaaaaaaaa");
        wx.request({
            url: app.appUrl + 'binding', //仅为示例，并非真实的接口地址
            data: {
                name: e.detail.value.username,
                password: e.detail.value.password,
                unionid: wx.getStorageSync('unionid'),
                phone:that.data.phone
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (res) {
                console.log("bbbbbbbbbb")
                console.log(res.data)
                if (res.data == '输入正确的用户名') {
                    wx.showModal({
                        title: '提示',
                        content: '输入正确的用户名！',
                        showCancel: false,
                        success: function (res) {
                            if (res.confirm) {
                                console.log('用户点击确定')
                            } else if (res.cancel) {
                                console.log('用户点击取消')
                            }
                        }
                    })
                }
                if (res.data == '输入正确的密码'){
                    wx.showModal({
                        title: '提示',
                        content: '请输入正确的密码！',
                        showCancel: false,
                        success: function (res) {
                            if (res.confirm) {
                                console.log('用户点击确定')
                            } else if (res.cancel) {
                                console.log('用户点击取消')
                            }
                        }
                    })
                }
                if (res.data.sult === true) {
                    
                    wx.navigateTo({
                        url: "/pages/my/my",
                    })
                    wx.showModal({
                        
                        title: '提示',
                        content: '账户绑定成功！',
                        showCancel:false,
                        success: function (res) {
                            if (res.confirm) {
                                console.log('用户点击确定')
                            } else if (res.cancel) {
                                console.log('用户点击取消')
                            }
                        }
                    })
                   
                }
                if (res.data.sult === false) {

                    wx.navigateTo({
                        url: "/pages/my/my",
                    })
                    wx.showModal({

                        title: '提示',
                        content: '账户绑定失败！',
                        showCancel: false,
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

    }

})
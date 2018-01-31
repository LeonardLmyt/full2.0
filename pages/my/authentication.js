var app = getApp();
Page({
    data: {
        phone: '',
        validate: '',
        phone_warning: true,
        validate_warning: true,
        nickname:'',

        ok: false,
        send: {
            key: true,
            time: 60
        }
    },
    onLoad: function (options) {
        var that = this
        var name1 = wx.getStorageSync('nickname')
        that.setData({
            nickname:name1
        })

    },
    onReady: function () {

    },
    onShow: function () {

    },



    addPhone: function (e) {
        let t = this,
            value = e.detail.value
        t.setData({
            phone: value
        })
        if (!/(^1[3|4|5|7|8][0-9]{9}$)/.test(value)) {
            t.setData({
                phone_warning: false
            })
            t.ok(false, false)
        } else {
            t.setData({
                phone_warning: true
            })
            t.ok(true, t.data.phone_warning)
        }
    },



    addValidate: function (e) {
        let t = this,
            value = e.detail.value
        t.setData({
            validate: value
        })
        if (!value) {
            t.setData({
                validate_warning: false
            })
            t.ok(false, false)
        } else {
            t.setData({
                validate_warning: true
            })
            t.ok(t.data.phone_warning, true)
        }
    },
    ok: function (p, v) {
        if (p && v) {
            this.setData({
                ok: true
            })
        } else {
            this.setData({
                ok: false
            })
        }
    },
    check: function (e) {
        let t = this
        if (!/(^1[3|4|5|7|8][0-9]{9}$)/.test(t.data.phone)) {
            t.setData({
                phone_warning: false
            })
        } else {
            t.setData({
                phone_warning: true
            })
        }
        if (!t.data.validate) {
            t.setData({
                validate_warning: false
            })
        } else {
            t.setData({
                validate_warning: true
            })
        }
    },
    Send: function (e) {
        console.log("aaaaaaaaaaaa")
        console.log(e)
        let t = this,
            ds = e.currentTarget.dataset
        if (ds.key) {
            t.data.send.key = false
            t.countDown()
        } else {
            if (t.data.send.time === 0) {
                t.data.send.key = true
            }
        }
        t.setData({
            send: t.data.send
        })
        wx.request({
            url: app.appUrl + 'send', //仅为示例，并非真实的接口地址
            data: {
                phone: t.data.phone
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (res) {
                console.log("UUUUUUUUUUUUUUUU")
                console.log(res)
                console.log(res.data)
            }
        })
    },
    countDown: function () {
        let t = this,
            time = setInterval(function () {
                t.data.send.time -= 1
                t.setData({
                    send: t.data.send
                })
                if (t.data.send.time === 0) {
                    clearInterval(time)
                    t.data.send.key = true
                    t.data.send.time = 60
                    t.setData({
                        send: t.data.send
                    })
                }
            }, 1000)
    },
    formSubmit: function (e) {
        var that = this;
        wx.request({
            url: app.appUrl + 'binding1', //仅为示例，并非真实的接口地址
            data: {
                mobile: that.data.phone,
                code: that.data.validate,
                unionid: wx.getStorageSync('unionid')
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (res) {
                var error = res.data.error
                console.log(res)
                if (res.error == "绑定到论坛用户成功") {

                    wx.showModal({
                        title: '提示',
                        content: '绑定到论坛用户成功',
                        showCancel: false,
                        success: function (res) {
                            if (res.confirm) {
                                console.log('用户点击确定')
                            } else if (res.cancel) {
                                console.log('用户点击取消')
                            }
                        }
                    })
                    //   wx.redirectTo({
                    //       url: 'pages/my/my'
                    //   })
                    wx.switchTab({
                        url: '/pages/my/my'
                    })
                } else {
                    wx.showModal({
                        title: '提示',
                        content: error,
                        showCancel: false,
                        success: function (res) {
                            if (res.confirm) {
                                console.log('用户点击确定')
                            }
                        }
                    })
                }
            }
        })
    },
    getPhoneNumber: function (e) {
        var that = this;
        console.log("rrrrrrrrrrrrrrrr")
        console.log(e)
        console.log(e.detail.errMsg)
        console.log(e.detail.iv)
        console.log(e.detail.encryptedData)
        if (e.detail.errMsg == 'getPhoneNumber:ok') {
            var encryptedData = e.detail.encryptedData
            var iv = e.detail.iv
            wx.login({
                success: function (res) {
                    if (res.code) {
                        //发起网络请求
                        wx.request({
                            url: app.appUrl + 'getPhone', //仅为示例，并非真实的接口地址
                            data: {
                                encryptedData: encryptedData,
                                iv: iv,
                                code: res.code
                            },
                            header: {
                                'content-type': 'application/json' // 默认值
                            },
                            success: function (res) {
                                //得到手机号后进行请求查询论坛是否有这个手机号。有，跳绑定，无：提示用户论坛有无帐号，1有账号用户名绑定，2无账号建新用户
                                if (res.data.sult.phoneNumber) {
                                    that.setData({
                                        phone: res.data.sult.phoneNumber
                                    })
                                    console.log("ssssssssssssssssssssssssssssss")
                                    console.log(that.data.phone)
                                    //查询是否已经绑定了手机号。
                                    wx.request({
                                        url: app.appUrl+'is_bind', //仅为示例，并非真实的接口地址
                                        data: {
                                            phone: that.data.phone,
                                            unionid:wx.getStorageSync('unionid')
                                        },
                                        header: {
                                            'content-type': 'application/json' // 默认值
                                        },
                                        success: function (res) {
                                            console.log(res.data)
                                        }
                                    })


                                    wx.request({
                                        url: app.appUrl + 'getPhoneUser', //仅为示例，并非真实的接口地址
                                        data: {
                                            phone: that.data.phone
                                        },
                                        header: {
                                            'content-type': 'application/json' // 默认值
                                        },
                                        success: function (res) {
                                            console.log("jjjjjjjjjjjjj")
                                            console.log(res.data)
                                            //如果有这个号的信息跳到绑定帐号，没有这个号的信息跳新建的页面。
                                            if (res.data.sult == true) {
                                                wx.showModal({
                                                    title: '提示',
                                                    confirmText: '关联账户',
                                                    cancelText: '取消',
                                                    content: '这个手机号已经在论坛绑定过帐号，是否关联论坛中该手机号的账户',
                                                    success: function (res) {
                                                        if (res.confirm) {
                                                            console.log('用户点击关联账户')
                                                            wx.request({
                                                                url: app.appUrl + 'bind_forum_phone', //仅为示例，并非真实的接口地址
                                                                data: {
                                                                    unionid: wx.getStorageSync('unionid'),
                                                                    phone: that.data.phone
                                                                },
                                                                header: {
                                                                    'content-type': 'application/json' // 默认值
                                                                },
                                                                success: function (res) {
                                                                    console.log(res.data)
                                                                    
                                                                    wx.navigateTo({
                                                                        url: 'my'
                                                                    })
                                                                    wx.showToast({
                                                                        title: '绑定帐户成功',
                                                                        icon: 'success',
                                                                        duration: 3000
                                                                    })
                                                                }
                                                            })
                                                        } else if (res.cancel) {
                                                            console.log('用户点击取消')

                                                        }
                                                    }
                                                })
                                            } else {
                                                wx.showModal({
                                                    title: '提示',
                                                    content: '你是否在8264论坛中注册有账户？',
                                                    cancelText: '没有账户',
                                                    confirmText: '已有账户',
                                                    success: function (res) {
                                                        if (res.confirm) {
                                                            console.log('用户点击有账户')
                                                            wx.navigateTo({
                                                                url: 'binding?phone=' + that.data.phone
                                                            })

                                                        } else if (res.cancel) {

                                                            wx.request({
                                                                url: app.appUrl + 'is_only_username', //仅为示例，并非真实的接口地址
                                                                data: {
                                                                    username: wx.getStorageSync('nickname'),
                                                                },
                                                                header: {
                                                                    'content-type': 'application/json' // 默认值
                                                                },
                                                                success: function (res) {
                                                                    console.log(res.data)
                                                                    if (res.data.sult) {

                                                                        wx.showModal({
                                                                            title: '提示',
                                                                            content: '是否使用你的微信名作为你的昵称。',
                                                                            success: function (res) {
                                                                                if (res.confirm) {
                                                                                    console.log('用户点击确定用微信名作为昵称')
                                                                                    wx.request({
                                                                                        url: app.appUrl + 'newUserBind', //仅为示例，并非真实的接口地址
                                                                                        data: {
                                                                                            phone: that.data.phone,
                                                                                            unionid: wx.getStorageSync('unionid'),
                                                                                            username: wx.getStorageSync('nickname')
                                                                                        },
                                                                                        header: {
                                                                                            'content-type': 'application/json' // 默认值
                                                                                        },
                                                                                        success: function (res) {
                                                                                            console.log(res.data)
                                                                                            wx.navigateTo({
                                                                                                url: 'my'
                                                                                            })
                                                                                            if (res.data.error == '新建用户绑定成功') {
                                                                                                wx.showToast({
                                                                                                    title: '绑定成功',
                                                                                                    icon: 'success',
                                                                                                    duration: 2000
                                                                                                })
                                                                                            }
                                                                                        }
                                                                                    })
                                                                                } else if (res.cancel) {
                                                                                    console.log('用户点击取消')
                                                                                    wx.navigateTo({
                                                                                        url: 'input?phone=' + that.data.phone+'&username=' + that.data.nickname
                                                                                    })
                                                                                }
                                                                            }
                                                                        })

                                                                    } else {
                                                                        wx.navigateTo({
                                                                            url: 'input?phone=' + that.data.phone+'&username='+that.data.nickname
                                                                        })

                                                                    }
                                                                }
                                                            })


                                                        }
                                                    }
                                                })

                                            }
                                        }
                                    })
                                }
                            }
                        })
                    } else {
                        console.log('获取用户登录态失败！' + res.errMsg)
                    }
                }
            });

        }
    }
})
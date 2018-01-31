var app = getApp()
Page({
    data: {
        is_bind: '',
        avatarurl: wx.getStorageSync('avatarurl'),
        nickname: wx.getStorageSync('nickname'),
        phone: ''
    },
    onLoad: function (options) {
        var that = this
        //wx.setStorageSync('unionid', 'oO2EFj-WNP_G-yL9ABJaBVQYlrgI')
        wx.request({
            url: app.appUrl + 'getbind_info', //仅为示例，并非真实的接口地址
            data: {
                unionid: wx.getStorageSync('unionid')
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (res) {
                console.log(res);
                if (res.data.is_bind == false) {
                    that.setData({
                        is_bind: '绑定'
                    })
                } else {
                    that.setData({
                      is_bind: res.data.phone.substring(0, 3) + '****' + res.data.phone.substring(7, 11)
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
                                        url: app.appUrl + 'phone_is_bind', //仅为示例，并非真实的接口地址
                                        data: {
                                            phone: that.data.phone,
                                            unionid: wx.getStorageSync('unionid')
                                        },
                                        header: {
                                            'content-type': 'application/json' // 默认值
                                        },
                                        success: function (res) {
                                            console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
                                            console.log(res.data)
                                            //如果已经绑定，提示已经绑定了，不能再绑了
                                            if (res.data.sult) {
                                                wx.showModal({
                                                    title: '提示',
                                                    content: '你已经绑定了帐户，不能再绑了',
                                                    showCancel: false,
                                                    success: function (res) {
                                                        wx.navigateTo({
                                                            url: 'my'
                                                        })
                                                    }
                                                })
                                            }
                                            //如果用户信息没有绑定，进入绑定流程
                                            if (res.data.sult == false) {
                                                //查询论坛是否有这个手机号码的用户
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
                                                                                                    url: 'input?phone=' + that.data.phone + '&username=' + that.data.nickname
                                                                                                })
                                                                                            }
                                                                                        }
                                                                                    })

                                                                                } else {
                                                                                    wx.navigateTo({
                                                                                        url: 'input?phone=' + that.data.phone + '&username=' + that.data.nickname
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
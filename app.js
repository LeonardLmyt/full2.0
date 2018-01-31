const wc = require("./utils/wcache")
App({
  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    wx.login({
      success: function (res) {
        console.log("yyyyyyyyyyyyop")
        console.log(res)
        console.log("yyyyyyyyyyyyop")
        if (res.code) {
          var code = res.code
          wx.getUserInfo({
            success: function (res_user) {
              var userInfo = res_user.userInfo
              var nickName = userInfo.nickName
              var avatarUrl = userInfo.avatarUrl
              var gender = userInfo.gender //性别 0：未知、1：男、2：女
              var province = userInfo.province
              var city = userInfo.city
              var country = userInfo.country
              wx.request({
                //url:"http://localhost/ds/index.php/home/video/test",
                //url: 'http://172.18.37.24/newdx/laravel/public/api_forum/userLogin',
                url: "https://hd.huwaishequ.com/8264demo/public/api_forum/userLogin",
                //url: "http://api.8264.com/public/api_forum/userLogin",
                //url: "http://localhost/8264she/8264she/public/api_forum/userLogin",
                 //url: "https://hd.huwaishequ.com/8264forum/public/api_forum/userLogin",
                data: {
                  code: res.code,
                  encryptedData: res_user.encryptedData,
                  iv: res_user.iv
                },
                header: {
                  'content-type': 'application/json' // 默认值
                },
                success: function (res) {
                  console.log("bbbbbbbbbb")
                  console.log(res)
                  console.log("bbbbbbbbbbsss")
                  console.log()
                  wx.setStorageSync('nickname', res.data.sult.nickname)
                  wx.setStorageSync('avatarurl', res.data.sult.avatarurl)
                  wx.setStorageSync('unionid', res.data.sult.unionid)
                  //wx.setStorageSync('tids', '')
                  wx.setStorageSync('loginTimes', 0) //登录次数
                }
              })
            }
          })

        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });

  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {

  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {

  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {

  },
  //appUrl: "http://172.18.37.24/newdx/laravel/public/api_forum/",      
//appUrl:"https://hd.huwaishequ.com/8264demo/public/api_forum/",
//appUrl: "http://localhost/8264she/8264she/public/api_forum/",
  //appUrl: "http://api.sapp8848.net/api_forum/",
  appUrl:"https://hd.huwaishequ.com/8264demo/public/api_forum/",

  globalData: {
    unionid: null,
    nickname: null,
    avatarurl: null,
    userInfo: null,
    isToLowerVersion: false,
    tids:'',
    home:1
  }

})

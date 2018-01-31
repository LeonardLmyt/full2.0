let mixin = require('../../utils/mixin'),
  mx = null,
  app = getApp()
Page({


  data: {
    all_label: [],
    my_label: [],
    buttomshow: true,
    layer: {
      show: true,
      state: '',
      content: ''
    },
    operation: true
  },



  onLoad: function () {
    let that = this
    mx = new mixin(that)
    mx.layer({})
    //取得我保存的标签栏目
    wx.request({
      url: app.appUrl + "myForum_get",
      data: {
        unionid: wx.getStorageSync('unionid')
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var sult = res.data.myForum_get
        sult.forEach(function (val, ind) {
          sult[ind]['hidden'] = true
        })
        that.setData({
          my_label: sult
        })
        //取得所有的标签列表
        wx.request({
          url: app.appUrl + "classifyAll",
          data: {
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            that.setData({
              all_label: res.data.classifyAll
            })
            that.data.all_label.forEach(function (val, ind) {
              that.data.all_label[ind]['hidden'] = true
            })
            that.setData({
              all_label: that.data.all_label
            })
          }
        })
        mx.close();
      }
    })
  },



  Edit: function () {
    let that = this;
    that.data.my_label.forEach(function (val, ind) {
      that.data.my_label[ind].hidden = false;
    })
    that.data.all_label.forEach(function (val, ind) {
      that.data.all_label[ind].hidden = false;
    })
    that.setData({
      my_label: that.data.my_label,
      all_label: that.data.all_label,
      buttomshow: false
    })
  },




  Del: function (e) {
    var that = this,
      nind = that.getDelIndex(that.data.my_label, e.currentTarget.dataset.fid);
    var index = nind;
    var delLabel = that.data.my_label[index]
    if (!!that.data.operation) {
      that.setData({
        operation: false
      })
      wx.request({
        url: app.appUrl + "myForum_del",
        data: {
            unionid: wx.getStorageSync('unionid'),
          del_label: delLabel
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          if (res.statusCode == 200) {
            that.data.my_label.splice(nind, 1);
            console.log(that.data.my_label[index])
            that.setData({
              my_label: that.data.my_label,
              operation: true
            })
            mx.layer({ content: '删除成功', time: 2 })
          }
        }
      })
    }
  },



  Add: function (e) {
      let that = this,
        nind = that.getIndex(that.data.my_label, e.currentTarget.dataset.fid);
      if (nind == "jk" && !!that.data.operation) {
        let addindex = that.getIndex(that.data.all_label, e.currentTarget.dataset.fid);
        that.setData({
          operation: false
        })
        wx.request({
          url: app.appUrl + "myForum_put",
          data: {
              unionid: wx.getStorageSync('unionid'),
            add_label: that.data.all_label[addindex]
          },
        //   header: {
        //     'content-type': 'application/json' // 默认值
        //   },
          success: function (res) {
            that.data.my_label.push(that.data.all_label[addindex]);
            that.setData({
              my_label: that.data.my_label,
              operation: true
            })
            mx.layer({ content: '添加成功', time: 2 })
          }
        })
      } else {
        mx.layer({ content: '标签已存在', state: 'layer-warning', time: 2 })
      }
  },



  getIndex: function (arr, index) {
    let oval = "jk";
    for (let i = 0, j = arr.length; i < j; i++) {
      if (arr[i]["fid"] === index) {
        return i;
      }
    }
    return oval;
  },



  getDelIndex: function (arr, index) {
    let oval = 0;
    for (let i = 0, j = arr.length; i < j; i++) {
      if (arr[i]["fid"] === index) {
        return i;
      }
    }
    return oval;
  },



  redirectTo: function (e) {
    console.log("kkkkkkkkkkkkk")
    console.log(e)
    if (!!e.currentTarget.dataset.show) {
      wx.redirectTo({
        url: e.currentTarget.dataset.url + "& name=" + e.currentTarget.dataset.name
      })
    }
  }
})

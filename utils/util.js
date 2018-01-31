const md5 = require("./md5");
const config = require("./config");
const app = getApp();

// 参数是时间戳
function formatTime(ms) {
  var newDate = new Date();
  newDate.setTime(ms * 1000);
  return newDate.toLocaleDateString();
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function request(option, cb) {
    console.log("gggggggggggggggggg")
    console.log(option)
    console.log("gggggggggggggggggg")
  wx.request({
    url: option.url,
    data: option.data ? option.data : {},
    method: option.method ? option.method : 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    header: option.header ? option.header : { 'content-type': 'application/json' }, // 设置请求的 header
    success: function (res) {
      cb(res);
      //console.log('llllllllllll: ',option.data.page)
      if (option.data.page==1){
        for (let item in res.data) {
          console.log('llllllllllllll: ', res.data[item].tid)
          if (app.globalData.tids==''){
            app.globalData.tids=res.data[item].tid
          }else{
            app.globalData.tids = app.globalData.tids + ',' + res.data[item].tid
          }
          console.log(app.globalData.tids)
        }
      }
      
      
    },
    fail: function (error) {
      cb(error);
    }
  });
}

function md5Convert(configUrl, options) {
  var array = new Array();
  for (var key in options) {
    array.push(key);
  }
  array.sort();

  // 拼接有序的参数名-值串
  var paramArray = new Array();
  for (var index in array) {
    var key = array[index];
    paramArray.push(key + "=" + options[key]);
  }

  // md5编码获得签名
  var md5Source = paramArray.join("&");
  var sign = md5.hex_md5(md5Source + config.appSecret);

  options.sign = sign;

  var option = {
    url: configUrl,
    data: options
  };

  return option;
}

function showSuccess(msg, time, cb) {
  wx.showToast({
    title: msg,
    icon: 'success',
    duration: time
  });

  setTimeout(function () {
    cb();
  }, time);
}

function showLoading(title, icon) {
  wx.showToast({
    title: title ? title : '加载中',
    icon: icon ? icon : 'loading',
    duration: 5000
  });
}

function hideLoading() {
  wx.hideToast();
}

function json2Form(json) {
  var str = [];
  for (var p in json) {
    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));
  }
  return str.join("&");
}

module.exports = {
  formatTime: formatTime,
  request: request,
  md5Convert: md5Convert,
  showSuccess: showSuccess,
  showLoading: showLoading,
  hideLoading: hideLoading,
  json2Form: json2Form
}




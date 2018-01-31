const app = getApp();
const util = require("./util");
const config = require("./config");

function getIndexCate(cb) {
  var params = {
    act: 'nav',
    ctl: 'forumIndex',
    appname: config.appName,
    qt: Date.parse(new Date()) / 1000,
  }
  
  var option = util.md5Convert(config.url, params);
  util.request(option, (res, error) => {
    if (error) {
      cb(error);
    } else {
      cb(res);
    }
  });
}

function getCatList(cb){
  const params = {
    act: 'forum',
    ctl:'forumIndex',
    appname: config.appName,
    qt: Date.parse(new Date()) / 1000,
  }

  const option = util.md5Convert(config.url, params);
  util.request(option, (res, error) => {
    if (error) {
      cb(error);
    } else {
      cb(res);
    }
  });
}

function getHotList(cb, page){
  const params = {
    act: 'index',
    ctl:'forumIndex',
    page: page, 
    appname: config.appName,
    qt: Date.parse(new Date()) / 1000,
  }

  const option = util.md5Convert(config.url, params);
  util.request(option, (res, error) => {
    if (error) {
      cb(error);
    } else {
      cb(res);
    }
  });
}

function getBBSList(cb, ...args){
  const params = {
    act: 'showlist',
    ctl:'thread',
    wxcode: args.code,
    appname: config.appName,
    qt: Date.parse(new Date()) / 1000,
  }

  Object.assign(params, ...args);

  const option = util.md5Convert(config.url, params);
  util.request(option, (res, error) => {
    if (error) {
      cb(error);
    } else {
      cb(res);
    }
  });
}

function getContent(cb, ...args){
  const params = {
    act: 'showview',
    ctl:'thread',
    appname: config.appName,
    qt: Date.parse(new Date()) / 1000,
  }

  Object.assign(params, ...args);

  const option = util.md5Convert(config.url, params);
  util.request(option, (res, error) => {
    if (error) {
      cb(error);
    } else {
      cb(res);
    }
  });
}

function wxLogin(cb, code) {
  const params = {
    act: 'wechat',
    ctl:'login',
    wxcode: code,
    appname: config.appName,
    qt: Date.parse(new Date()) / 1000,
  }
    
  const option = util.md5Convert(config.url, params);
  util.request(option, (res, error) => {
    if (error) {
      cb(error);
    } else {
      cb(res);
    }
  });
}

function binding(cb, args) {
  const { username, password, type } = args;
  const params = {
    act: type,
    ctl: 'login',
    appname: config.appName,
    qt: Date.parse(new Date()) / 1000
  }

  const option = util.md5Convert(config.url, params);
  const { act, ctl, appname, qt, sign } = option.data;
  const unionid_token = wx.getStorageSync('uniondidToken');
  const formData = {
    unionid_token,
    username
  }
  
  password ? Object.assign(formData, {password}) : '';

  wx.request({
    url: `${config.url}?act=${act}&ctl=${ctl}&appname=${appname}&qt=${qt}&sign=${sign}`,
    data: formData,
    method: 'POST',
    header: { 'content-type': 'application/x-www-form-urlencoded' },
    success: function(res) {
      cb(res);
    },
    fail: function(error) {
      cb(error);
    }
  });
}

// 测试数据
function unbind(cb, code) {
  const params = {
    act: 'unbind',
    ctl:'login',
    wxcode: code,
    appname: config.appName,
    qt: Date.parse(new Date()) / 1000,
  }
    
  const option = util.md5Convert(config.url, params);
  util.request(option, (res, error) => {
    if (error) {
      cb(error);
    } else {
      cb(res);
    }
  });
}

function forumPost(cb, args) {
  const params = {
    act: 'doReply',
    ctl: 'forumPost',
    replysubmit: 'reply',
    appname: config.appName,
    qt: Date.parse(new Date()) / 1000
  }

  const { tid, message } = args;

  const option = util.md5Convert(config.url, params);
 
  const { act, ctl, appname, replysubmit, qt, sign } = option.data;
  console.log("args------------")
  var ss = "${config.url }?act = ${act }&ctl=${ctl } & appname=${appname } & replysubmit=${replysubmit } & qt=${qt } & sign=${sign }";
  console.log(ss)
  console.log("args------------")
  wx.request({
    url: `${config.url}?act=${act}&ctl=${ctl}&appname=${appname}&replysubmit=${replysubmit}&qt=${qt}&sign=${sign}`,
    data: {
      token: wx.getStorageSync('jwt').token,
      tid: tid,
      message: message
    },
    method: 'POST',
    header: { 'content-type': 'application/x-www-form-urlencoded' },
    success: function(res) {
      cb(res);
    },
    fail: function(error) {
      cb(error);
    }
  });
}

module.exports = {
  getHotList: getHotList,
  getIndexCate: getIndexCate,
  getCatList: getCatList,
  getBBSList: getBBSList,
  getContent:getContent,
  wxLogin: wxLogin,
  binding: binding,
  unbind: unbind,      // 测试数据
  forumPost: forumPost
}
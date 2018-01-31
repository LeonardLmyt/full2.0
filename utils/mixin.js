/*超类，实现多继承*/
function Super(wx) {
  this.wx = wx
  this.SuperParam = {

  }
  if (!this.layer) {
    /* 弹出提示
       @param {[String]} state 提示类型 layer-loading--加载 layer-warning--警告 layer-error--错误
       @param {[String]} content 提示内容
       @param {[Number]} time 提示时长 -1 为永久
    */
    Super.prototype.layer = function (p) {
      /* 弹出提示
       @param {[String]} state 提示类型 layer-loading--加载 layer-warning--警告 layer-error--错误
       @param {[String]} content 提示内容
       @param {[Number]} time 提示时长 -1 为永久
    */
      let l = this.wx.data.layer,
        timeout
      if (!timeout) {
        l.state = !!p.state ? p.state : 'layer-loading'
        l.content = !!p.content ? p.content : '加载中...'
        l.show = false
        this.wx.setData({
          layer: l
        })
        if (!(p.time === -1 || !('time' in p))) {
          timeout = setTimeout(function () {
            l.show = true
            this.wx.setData({
              layer: l
            })
            clearTimeout(timeout)
          }.bind(this), (!!p.time ? p.time | 0 : 2) * 1000)
        }
      }
    };
    /* 关闭提示 */
    Super.prototype.close = function () {
      let l = this.wx.data.layer
      l.show = true
      this.wx.setData({
        layer: l
      })
    }
  }
}


function OtherSuper() {
  this.OtherSuperParam = 0;
}
OtherSuper.prototype.OtherSuperFunction = function () {

};

//Binding to a parent class
function MyClass(wx) {
  Super.call(this, wx);
  OtherSuper.call(this);
}

MyClass.prototype.MyClassFunction = function () {
};

// inherit one class
MyClass.prototype = Object.create(Super.prototype);
// mixin another
Object.assign(MyClass.prototype, OtherSuper.prototype);
// re-assign constructor
MyClass.prototype.constructor = MyClass;

module.exports = MyClass;
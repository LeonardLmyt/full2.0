let mixin = require('../../utils/mixin'),
  mx = null

Page({
  data: {
    layer: {
      show: true,
      state: '',
      content: ''
    },
    title: '',
    section: [

    ],
    release: false
  },
  onLoad: function (options) {
    let t = this,
      post_data = wx.getStorageSync('post_data'),
      post_title = wx.getStorageSync('post_title')
    mx = new mixin(t)

    if (!!post_title) {
      t.setData({
        title: post_title
      })
    }

    if (!!post_data){
      let firstTitle = t.firstTitle(post_data)
      t.setData({
        section: firstTitle
      })
      t.release()
    }
  },
  toggleOrder: function (e) { //调换顺序，双向事件
    let t = this
    this.agency(e.currentTarget.dataset.type, e.currentTarget.dataset.index)
    t.setStorage()
  },
  agency: function (d, i) { //移动数组中介者
    let t = this,
      data = t.data.section,
      s = data.splice(i, 1) //截取的数组
    if (d === 'up') {//上移
      data.splice(i - 1, 0, s[0])
    } else { //下移
      data.splice(i + 1, 0, s[0])
    }
    t.setData({
      section: data
    })
  },
  delSection: function (e) {
    let t = this
    t.data.section.splice(e.currentTarget.dataset.index, 1) //截取的数组
    t.setData({
      section: t.data.section
    })
    t.setStorage()
  },
  addImg: function () { //添加图片
    let t = this,
      count = 6 - t.data.section.length
    wx.chooseImage({
      count: count,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        let add = res.tempFilePaths.map(x => { return { img: x, content: '' } })
        t.data.section.push(...add)
        let firstTitle = t.firstTitle(t.data.section)
        t.setData({
          section: firstTitle
        })

        t.release()
        t.setStorage()
      }
    })
  },
  editImg: function () { //编辑封面
    let t = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        let first = { img: res.tempFilePaths[0], content: t.data.section[0].content }
        t.data.section.splice(0, 1, first)
        let firstTitle = t.firstTitle(t.data.section)
        t.setData({
          section: firstTitle
        })
        t.setStorage()
      }
    })
  },
  firstTitle: function (d) { //重置标题
    let t = this,
      first = { img: d[0].img, content: t.data.title }
    d.splice(0, 1, first)
    return d
  },
  addContent: function (e) { //添加内容
    let t = this,
      i = e.currentTarget.dataset.index
    t.data.section[i].content = e.detail.value
    t.setStorage()
  },
  release: function () { //是否发布
    let t = this
    this.setData({
      release: !!t.data.section.length ? true : false
    })
  },
  setStorage: function () {
    let t = this
    wx.setStorage({
      key: 'post_data',
      data: t.data.section,
    })
  }, 
  preview:function(){
    if (this.data.release){


      
      wx.navigateTo({
        url: '/pages/cate/preview',
      })
    }
  }
})
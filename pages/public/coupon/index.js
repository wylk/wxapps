var t = getApp(),
  e = t.requirejs("core"),
  s = t.requirejs("jquery");
Page({
  data: {
    store:!1,
    imgUrls: [
      'https://mall.epaikj.com/static/weixinapp/1_463.jpg',
      'https://mall.epaikj.com/static/weixinapp/1_519.jpg',
      'https://mall.epaikj.com/static/weixinapp/1_888.jpg'
    ],
    indicatorDots: 1,
    autoplay: 1,
    interval: 5000,
    duration: 1000,
  },
  onLoad: function (e) {
    
  },
  onShow: function () {
    
  },
  toast :function(){
    console.log(2134);
    wx.switchTab({
      url: '/pages/index/index'
    })
  }
})
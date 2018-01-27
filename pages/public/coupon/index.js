var t = getApp(),
  e = t.requirejs("core"),
  s = t.requirejs("jquery");
Page({
  data: {
    store:!1,
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
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
var t = getApp(),
r = t.requirejs("core");
Page({
  data: {},
  onLoad: function () {
    // console.log(r);
    console.log(t);
      this.setData({
        close: t.close,
        text: t.text
      })
  },
  onShow: function () {
    var e = t.getCache("sysset").shopname;
    wx.setNavigationBarTitle({
      title: e || "提示"
    })
  }
})
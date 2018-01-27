var t = getApp(),
  e = t.requirejs("core"),
  s = t.requirejs("jquery");
Page({
  data: {
    loading: true,
    success: 1,
    show:!1,
  },
  onLoad: function (e) {
    console.log(e)
    this.setData({
      orderno: e.orderno
    });
  },
  onShow: function () {
    this.getList()
  },
  getList: function () {
    var tt = this;
    var orderno = tt.data.orderno;
    e.get("test/order_status", { orderno: orderno}, function (i) {
      tt.setData({
        order:i.msg,
        show: 1,
      })
    })
  },
  toast: function(){
    var orderno =  this.data.orderno;
    wx.navigateTo({
      url: '/pages/order/detail/index?id=' + orderno
    })
  }
})
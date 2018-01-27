var t = getApp(),
  e = t.requirejs("core"),
  i = t.requirejs("biz/order");
Page({
  data: {
    code: false,
    consume: false,
    store: false,
    cancel: i.cancelArray,
    cancelindex: 0,
    diyshow: {},
    order: {}

  },
  onLoad: function (e) {
    this.setData({
      options: e
    }),
      t.url(e)
  },
  onShow: function () {
    this.get_list()
  },
  get_list: function () {
    var t = this;
    //console.log(t.data.options);
    e.get("order/detail", t.data.options, function (i) {
      //console.log(i);
      // i.err_code ?
      0 == i.err_code ? (i.show = true,i.order = i.err_msg, t.setData(i)) : (5e4 != i.err_code && e.toast(i.err_msg, "loading"), wx.redirectTo({
        url: "pages/order/index"
      }))
      /*0 == i.err_code ? (i.show = true, t.setData(i.err_msg)) : (5e4 != i.err_code && e.toast(i.err_msg, "loading"), wx.redirectTo({
        url: "pages/order/index"
      }))*/
    })
    console.log(t.data.order);
  },
  code: function (t) {
    var i = this,
      a = e.data(t).orderid;
    e.post("verify/qrcode", {
      id: a
    }, function (t) {
      0 == t.error ? i.setData({
        code: true,
        qrcode: t.url
      }) : e.alert(t.message)
    }, true)
  },
  diyshow: function (t) {
    var i = this.data.diyshow,
      a = e.data(t).id;

    i[a] = !i[a],
      this.setData({
        diyshow: i
      })

  },
  close: function () {
    this.setData({
      code: false
    })
  },
  toggle: function (t) {
    var i = e.pdata(t),
      a = i.id,
      o = i.type,
      n = {};
    n[o] = 0 == a || void 0 === a ? 1 : 0,
      this.setData(n)
  },
  phone: function (t) {
    e.phone(t)
  },
  cancel: function (t) {
    i.cancel(this.data.options.id, t.detail.value, "/pages/order/detail/index?id=" + this.data.options.id)
  },
  delete: function (t) {
    var a = e.data(t).type;
    i.delete(this.data.options.id, a, "/pages/order/index")
  },
  finish: function (t) {
    i.finish(this.data.options.id, "/pages/order/index")
  },
  refundcancel: function (t) {
    var e = this;
    i.refundcancel(this.data.options.id, function () {
      e.get_list()
    })
  },
  onShareAppMessage: function () {
    return e.onShareAppMessage()
  }
})

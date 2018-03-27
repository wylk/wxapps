var e = getApp(),
  r = e.requirejs("core"),
  t = e.requirejs("wxParse/wxParse");
Page({
  data: {
    route: "member",
    icons: e.requirejs("icons"),
    member: {}

  },
  onLoad: function (r) {
    console.log(e.getCache("userinfo"));
    // return;
    e.url(r)
      // e.getCache("userinfo") || wx.redirectTo({
      //   url: "/pages/message/auth/index"
      // })
  },
  getInfo: function () {
    var e = this;
    r.get("ucenter/index", {}, function (res) {
      console.log(res);
      if(res.err_code == 0){
        // t.wxParse("wxParseData","html", res.err_msg.store_user_data,e, "5")
        e.setData({
          member: res.err_msg,
          show: true
        }),
        console.log(e.data.member);
      }
     /* 0 != r.error ? wx.redirectTo({
        url: "/pages/message/auth/index"
      }) : e.setData({
        member: r,
        show: !0
      }),
        t.wxParse("wxParseData", "html", r.copyright, e, "5")*/
    })
  },
  onShow: function () {
    this.getInfo()
  },
  onShareAppMessage: function () {
    return r.onShareAppMessage()
  }
})

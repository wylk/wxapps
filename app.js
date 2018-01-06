//app.js
var e = require("utils/core.js");
App({
  onLaunch: function () {
    var e = this.getCache("userinfo");
    e ||  this.getUserInfo(function (e) {}, function (e, t) {
      var t = t ? 1 : 0;
      //页面重定向
      console.log(e.msg);
      t && this.setCache("userinfo", e.msg, 7200);
     /* wx.redirectTo({
        url: "/pages/message/auth/index?close=" + t + "&text=" + e
      })*/
    })
  },
  requirejs: function (e) {
    return require("utils/" + e + ".js")
  },
  getCache: function (e, t) {
    var i = +new Date / 1000,
      n = "";
    i = parseInt(i);
    try {
      n = wx.getStorageSync(e + this.globalData.appid),
        n.expire > i || 0 == n.expire ? n = n.value : (n = "", this.removeCache(e))
    } catch (e) {
      n = void 0 === t ? "" : t
    }
    return n = n || ""
  },
  setCache: function (e, t, i) {
    var n = +new Date / 1000,
      a = true,
      o = {
        expire: i ? n + parseInt(i) : 0,
        value: t
      };
    try {
      wx.setStorageSync(e + this.globalData.appid, o)
    } catch (e) {
      a = false
    }
    return a
  },
  removeCache: function (e) {
    var t = true;
    try {
      wx.removeStorageSync(e + this.globalData.appid)
    } catch (e) {
      t = false
    }
    return t
  },
  getUserInfo: function (t, i) {
    var n = this,
      a = n.getCache("userinfo");
    if (a && !a.needauth)
      return void (t && "function" == typeof t && t(a));
    wx.login({
      success: function (o) {
        if (!o.code)
          return void e.alert("获取用户登录态失败:" + o.errMsg);
        e.post("public/login", {
          code: o.code
        }, function (o) {

          return o.error  == 2 ? void e.alert("获取用户登录态失败:" + o.msg) : o.error == 0 ? void n.setCache("userinfo", o.msg, 7200) : void wx.getUserInfo({
            success: function (i) {
              a = i.userInfo,
                e.get("public/auth", {
                  data: i.encryptedData,
                  iv: i.iv,
                  sessionKey: o.msg.session_key
                }, function (e) {
                  i.userInfo.openid = e.msg.openId,
                    i.userInfo.id = e.msg.id,
                    i.userInfo.uniacid = e.msg.uniacid,
                    i.needauth = 0,
                    n.setCache("userinfo", e.msg, 7200),
                    t && "function" == typeof t && t(a)
                })
            },
            fail: function () {
              e.get("public/check", {
                openid: o.msg.openid
              }, function (e) {
                e.needauth = 1,
                  n.setCache("userinfo", e, 7200),
                  t && "function" == typeof t && t(a)
              })
            }
          })
        })
      },
      fail: function () {
        e.alert("获取用户信息失败!")
      }
    })
  },
  getSet: function () {
    var t = this;
    "" == t.getCache("sysset") && setTimeout(function () {
      var i = t.getCache("cacheset");
      e.get("cacheset", {
        version: i.version
      }, function (e) {
        e.update && t.setCache("cacheset", e.data),
          t.setCache("sysset", e.sysset, 7200)
      })
    }, 10)
  },
  url: function (e) {
      this.setCache("mid", {mid:111}, 7200)
  },
  globalData: {
    appid: "wx0374e8ef4f1d6f8e",
    api: "https://mall.epaikj.com/wxapp.php?",
    approot: "https://mall.epaikj.com/",
    userInfo: null
  }
})
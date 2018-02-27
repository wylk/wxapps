var t = getApp(),
  a = t.requirejs("core"),
  e = t.requirejs("biz/order");
Page({
  data: {
    icons: t.requirejs("icons"),
    status: "",
    list: [],
    page: 1,
    code: false,
    cancel: e.cancelArray,
    cancelindex: 0,
    status1: ''
  },
  onLoad: function (a) {
    this.setData({
      options: a,
      status: a.status || ""
    }),
      t.url(a),
      this.get_list()
  },
  return_apply: function (t) {
    var that = this;
    var pigcms_id = a.data(t).id;
    var order_no = a.data(t).orderno;
    console.log(pigcms_id);
    console.log(order_no);
    a.get('order/return_apply', { pigcms_id: pigcms_id, order_no: order_no }, function (res) {
      if (res.err_code == 0) {
        console.log(res.err_msg)
      } else {
        console.log(res.err_msg);
      }
    })
  },
  get_list: function () {
    var t = this;
    t.setData({
      loading: true
    });
    var status = t.data.status;
    // console.log(typeof status)
    console.log(t.data.status);
    a.get("order/user_all", {
      page: t.data.page,
      status: t.data.status,
      status1: t.data.status1,
      merchid: 0
    }, function (e) {
      0 == e.err_code ? (t.setData({
        loading: false,
        show: true,
        total: e.total,
        empty: true
      }), e.err_msg.list.length > 0 && t.setData({
        page: t.data.page + 1,
        list: t.data.list.concat(e.err_msg.list)
      }), e.err_msg.list.length < e.pagesize && t.setData({
        loaded: true
      })) : a.toast(e.message, "loading")
    }, this.data.show)
  },
  selected: function (t) {
    var e = a.data(t).type;
    this.setData({
      list: [],
      page: 1,
      status: e,
      empty: false
    }),
      this.get_list()
  },
  onReachBottom: function () {
    this.data.loaded || this.data.list.length == this.data.total || this.get_list()
  },
  code: function (t) {
    var e = this,
      s = a.data(t).orderid;
    a.post("verify/qrcode", {
      id: s
    }, function (t) {
      0 == t.error ? e.setData({
        code: true,
        qrcode: t.url
      }) : a.alert(t.message)
    }, true)
  },
  close: function () {
    this.setData({
      code: false
    })
  },
  cancel: function (t) {
    var that = this;
    var s = a.data(t).orderid;
    console.log(s);
    console.log(this.data.status);
    // return;
    a.confirm("是否确认取消此订单?", function () {
      a.post("order/cancel", {
        del_id: s
      }, function (t) {
        if (t.err_code == 0) {
          wx.showModal({
            title: '提示',
            content: t.err_msg,
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/order/index?status=' + that.data.status
                })
              }
            }
          })
          /* a.alert(t.err_msg,function(){
              wx.navigateTo({
               url: '/pages/order/index?status='+that.data.status
             })
           });*/

        } else {
          wx.showModal({
            title: '提示',
            content: t.err_msg,
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/order/index?status=' + that.data.status
                })
              }
            }
          })
        }
      });
    });
  },
  delete: function (t) {
    var s = a.data(t).type,
      i = a.data(t).orderid;
    e.delete(i, s, "/pages/order/index", this)
  },
  // 确认收货
  finish: function (t) {
    var that = this;
    var s = (a.data(t).type, a.data(t).orderid);
    console.log(s);
    console.log(that.data.status);

    // return;
    a.post('order/receive', { order_no: s }, function (res) {
      console.log(res);
      if (res.err_code == 0) {
        wx.showModal({
          title: '提示',
          content: res.err_msg,
          showCancel: false,
          success: function (re) {
            if (re.confirm) {
              wx.navigateTo({
                url: '/pages/order/index?status=' + that.data.status
              })
            }
          }
        })
      } else {
        wx.showModal({
          title: '提示',
          content: t.err_msg,
          showCancel: false,
          success: function (re) {
            if (re.confirm) {
              wx.navigateTo({
                url: '/pages/order/index?status=' + that.data.status
              })
            }
          }
        })
      }
    })
    // e.finish(s, "/pages/order/index")
  },
  //订单交易完成
  complete: function (t) {
    var that = this;
    var s = (a.data(t).type, a.data(t).orderid);
    console.log(s);
    console.log(that.data.status);

    // return;
    a.post('order/complete', { order_no: s }, function (res) {
      console.log(res);
      if (res.err_code == 0) {
        wx.showModal({
          title: '提示',
          content: res.err_msg,
          showCancel: false,
          success: function (re) {
            if (re.confirm) {
              wx.navigateTo({
                url: '/pages/order/index?status=' + that.data.status
              })
            }
          }
        })
      } else {
     a.alert(res.err_msg);
      }
    })
    // e.finish(s, "/pages/order/index")
  },
  onShareAppMessage: function () {
    return a.onShareAppMessage()
  }
})

var t = getApp(),
  e = t.requirejs("core"),
  i = t.requirejs("foxui");
Page({
  data: {
    icons: t.requirejs("icons"),
    success: false,
    order_no: !1,
    successData: {},
    list: !1,
    product_list: !1,
    store: !1,
    user_address: !1,
    is_ep: !1,
    user_address_list: !1,

  },
  onLoad: function (e) {
    console.log(e);
    this.setData({
      order_no: e.order_no
    });
  },
  onShow: function () {
    this.get_list()
  },
  get_list: function () {
    var t = this;
    e.get("test/pay", { order_no: this.data.order_no }, function (i) {
      console.log(i);
      if (i.err_code == 0) {
        i.err_msg.user_address || wx.navigateTo({
          url: '/pages/test/test/index'
        });
        t.setData({
          show: 1,
          list: i.err_msg
        });
      } else {
        e.alert(i.err_msg);
      }
    })
  },
  save: function () {
    wx.navigateTo({
      url: "/pages/index/index"
    })
  },
  pay: function (t) {
    wx.showLoading({
      title: '操作中',
      mask: true
    });
    var data = {}
    data.payType = e.pdata(t).type;
    data.address_id = this.data.list.user_address.address_id;
    data.postage_list = this.data.list.postage_list;
    data.is_app = true;
    data.orderNo = this.data.order_no;
    data.appType = 'wxapp';
    e.post("order/saveorder", data, function (re) {
      wx.hideLoading();
      if (re.err_code == 0) {
        console.log(re);
        e.pay(re.err_msg, function (t) {
          console.log(t);
          "requestPayment:ok" == t.errMsg && console.log('支付成功。。。');
        }, function (e) {
          console.log(e);
        })
      }
    })
  },//选择eb
  check_eb: function () {
    var tt = this,
    is_ep = !tt.data.is_ep,
    is_eb = !1,
    total = parseFloat(tt.data.list.order.total),
    order_id = tt.data.list.order.order_id,
    eb = parseFloat(tt.data.list.user.point_unbalance / 100);
    if (eb >= total){
      is_eb = is_ep;
    }else{
      e.post("order/check_eb", {type: is_ep,eb:eb,order_id:order_id}, function (i) {

    })
    }
    tt.setData({
      is_ep:is_ep,
      is_eb:is_eb
      })
  }
})
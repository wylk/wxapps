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
  save: function(){
    console.log(1212);
    wx.navigateTo({
              /* url: "/pages/order/create/index?id=" + i.data.options.id + "&total=" + i.data.total + "&optionid=" + s + "&gdid=" + t.gdid*/
              // url: "/pages/test/test/index?address_id="+this.data.list.user_address.address_id
              url:"/pages/index/index"
            })    
  },
  pay: function (t) {
    var data = {}
    data.payType = e.pdata(t).type;
    data.address_id = this.data.list.user_address.address_id;
    data.postage_list = this.data.list.postage_list;
    data.is_app = true;
    data.orderNo = this.data.order_no;
    data.appType = 'wxapp';
    console.log(data);
    e.post("order/saveorder", data, function (re) {
      if(re.err_code == 0){
        console.log(re);
        e.pay(re.err_msg, function (t) {
          console.log(t);
          "requestPayment:ok" == t.errMsg && console.log('支付成功。。。');
        },function(e){
          console.log(e);
        })
      }
    })
  },
  complete: function (t) {
    var o = this;
    e.post("order/pay/complete", {
      id: o.data.options.id,
      type: t
    }, function (t) {
      if (0 == t.error)
        return wx.setNavigationBarTitle({
          title: "支付成功"
        }), void o.setData({
          success: true,
          successData: t
        });
      i.toast(o, t.message)
    }, true, true)
  },
  shop: function (t) {
    0 == e.pdata(t).id ? this.setData({
      shop: 1
    }) : this.setData({
      shop: 0
    })
  },
  phone: function (t) {
    e.phone(t)
  }
})
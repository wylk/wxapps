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
    eb_msg: '',
    eb_html: '',
    showModalStatus: 1,
    showModalAddPass: 1,
    showModalAddEbPay: 1,
    pass: {},
    ex_btn:'btn-success',
    se_btn: '',
  },
  onLoad: function (e) {
    console.log(e);
    this.setData({
      order_no: e.order_no
    });
  },
  onShow: function () {
    this.get_list();
  },
  get_list: function (load = false,sef = false) {
    var t = this;
    e.get("test/pay", { order_no: this.data.order_no,sef:sef }, function (i) {
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

      if (load){
        wx.hideLoading();
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
    var tt = this;
    var data = {}
    data.payType = e.pdata(t).type;
    if (tt.data.is_sef){
      data.shipping_method = 'selffetch';
      data.selffetch_id = tt.data.list.selffetch_list[0].pigcms_id;
      data.selffetch_name = tt.data.list.user.nickname;
      data.selffetch_phone = tt.data.list.user.phone;
      //data.selffetch_date = $('.js-logistics-content .js-time').eq(0).val();
      //data.selffetch_time = $('.js-logistics-content .js-time').eq(1).val();
    }else{
      data.address_id = tt.data.list.user_address.address_id;
      data.postage_list = tt.data.list.postage_list;
    }
    
    data.is_app = true;
    data.orderNo = tt.data.order_no;
    data.appType = 'wxapp';
    if (tt.data.msg) {
      data.msg = tt.data.msg;
    }//order
    e.post("test/saveorder", data, function (re) {
      wx.hideLoading();
      console.log(re);
      //微信支付
      if (data.payType == 'weixin') {
        if (re.err_code == 0) {
          e.pay(re.err_msg, function (t) {
            console.log(t);
            if (t.errMsg == 'requestPayment:ok') {
              wx.navigateTo({
                url: "/pages/order/public/index?orderno=" + tt.data.order_no
              })
            } else {
              e.alert(e.errMsg);
            }

          }, function (i) {
            console.log(i);
            e.alert(i.errMsg);
          })
        }
      } else {
        //E币支付
        if (re.error == '2') {
          tt.setData({
            showModalAddPass: !1,
          });

        } else if (re.error == 0) {
          var eb_data_price = (re.data.pay_money * 100).toFixed(2);
          tt.setData({
            showModalAddEbPay: !1,
            eb_data: re.data,
            eb_data_price: eb_data_price
          })
        } else {

        }
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
    if (eb >= total) {
      is_eb = is_ep;
    } else {
      wx.showLoading({
        title: '操作中',
        mask: true
      });
      e.post("order/check_eb", { type: is_ep, eb: eb, order_id: order_id }, function (i) {
        wx.hideLoading();
        var html = '-' + i.eb_msg + 'E币';
        tt.setData({
          eb_msg: parseFloat(i.eb_msg).toFixed(2),
          eb_html: i.eb_msg ? html : '',
          is_ep: is_ep,
        })
      })
    }
    eb >= total && tt.setData({
      is_ep: is_ep,
      is_eb: is_eb
    })
  },
  buy_msg: function (i) {
    this.setData({ msg: i.detail.value });
  },
  hideModal: function (i) {
    // 显示遮罩层
    this.setData({ showModalStatus: false });
  },
  listenerCancel: function () {
    this.setData({
      showModalStatus: true,
      showModalAddPass: true,
      showModalAddEbPay: true,
    })
  },
  listenerConfirm: function () {
    var tt = this;
    var address_id = tt.data.address_id;
    !address_id || wx.showLoading({
      title: '操作中',
      mask: true
    });
    !address_id || e.post('cart/default_address', { address_id: address_id }, function (i) {
      if (i.err_code == '0') {
        tt.get_list();
        setTimeout(function () {
          tt.setData({
            showModalStatus: true
          });
          wx.hideLoading();
        }, 3000)


      }
    });
  },
  radioChange: function (e) {
    this.setData({
      address_id: e.detail.value
    })
  },
  passWdInput: function (i) {
    this.data.pass[i.target.id] = i.detail.value;
  },
  addPassword: function (i) {

    var data = this.data.pass;
    var pas1 = data.pas1,
      tt = this,
      pas2 = data.pas2;
    if (parseInt(pas1.length) < 5) {
      e.alert('密码不能少于6位'); return;
    }
    if (pas2 != pas1) {
      e.alert('两次密码不一致'); return;
    }
    wx.showLoading({
      title: '操作中',
      mask: true
    });
    e.post('test/editPassword', { password: pas1 }, function (re) {
      wx.hideLoading();
      tt.setData({
        showModalAddPass: 1,
      })
    });
  },
  password_pay: function (i) {
    this.setData({
      pay_password: i.detail.value
    })
  },
  eb_pay_pass: function () {
    var data = this.data.eb_data,
      password = this.data.pay_password;
    if (parseInt(password.length) < 5) {
      e.alert('密码不对'); return;
    }
    wx.showLoading({
      title: '操作中',
      mask: true
    });
    data.pay_password = password;
    e.post('test/eb_pay', data, function (re) {
      wx.hideLoading();
      if (re.error == 0) {
        wx.showToast({
          title: re.msg,
          icon: 'succes',
          duration: 1000,
          mask: true
        })
        setTimeout(function () {
          wx.hideToast()
          wx.navigateTo({
            url: "/pages/order/public/index?orderno=" + re.orderno
          })
        }, 2000)
      } else {
        e.alert(re.msg);
      }
      console.log(re);
    })
  },
  choice_expare: function(i){
    if (this.data.list.order.status == 1){
       return;
    }
    wx.showLoading({
      title: '操作中',
      mask: true
    });
    i.currentTarget.id
    if (i.currentTarget.id == 'sef'){
      var ex_btn =  '',
      se_btn =  'btn-success',
      is_sef = true;
      this.get_list(1,1);
    }else{
      var ex_btn = 'btn-success',
        se_btn = '',
        is_sef = false;
        this.get_list(1);
    }
    this.setData({
      ex_btn: ex_btn,
      se_btn: se_btn,
      is_sef: is_sef,
    })
    
  },
})
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
    order: {},
    array: [],
    index: 0,
    pigcms_id: "",
    order_no: ""
  },
   formSubmit: function(s) {
    var t = this;
    console.log('form发生了submit事件，携带数据为：', s.detail.value);
    if(s.detail.value.express_no.length == 0){
       wx.showToast({
         title: '单号不能为空',
         image: "/static/images/error.png",
         duration: 2000
       })
      return;
    }

    var postData = {id:t.data.return.id};
    postData.express_no = s.detail.value.express_no;
    postData.express_code = t.data.index;
     console.log(postData);
    // return;
    e.post('order/express',postData,function(res){
      console.log(res);
      if(res.err_code == 0){
        console.log(res.err_msg);
        wx.showModal({
          title: '提示',
          content: res.err_msg,
          showCancel: false,
          success: function(re) {
            if (re.confirm) {
                 wx.navigateTo({
                  url: '/pages/order/refund_detail/index?pigcms_id='+t.data.pigcms_id+'&order_no='+t.data.order_no
                })
            }
          }
        })
      }else{
        console.log(res.err_msg);
        wx.showModal({
          title: '提示',
          content: res.err_msg,
          showCancel: false,
          success: function(re) {
            if (re.confirm) {
                 wx.navigateTo({
                   url: '/pages/order/refund_detail/index?pigcms_id='+t.data.pigcms_id+'&order_no='+t.data.order_no
                })
            }
          }
        })
      }
    })
  },
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
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
    t.setData({
      pigcms_id: t.data.options.pigcms_id,
      order_no: t.data.options.order_no
    })
    console.log(t.data.pigcms_id);
    console.log(t.data.order_no);
    //console.log(t.data.options);
    e.get("order/return_detail", {pigcms_id:t.data.pigcms_id,order_no:t.data.order_no}, function (i) {
      //console.log(i);
      // i.err_code ?
      0 == i.err_code ? (i.show = true,i.return = i.err_msg.return,i.sku_data_arr=i.err_msg.sku_data_arr,i.return_list = i.err_msg.return_list,i.array = i.err_msg.return.express,t.setData(i)) : (5e4 != i.err_code && e.toast(i.err_msg, "loading"), wx.redirectTo({
        url: "pages/order/index"
      }))
      /*0 == i.err_code ? (i.show = true, t.setData(i.err_msg)) : (5e4 != i.err_code && e.toast(i.err_msg, "loading"), wx.redirectTo({
        url: "pages/order/index"
      }))*/
    })
    console.log(t.data.express);
  },

  onShareAppMessage: function () {
    return e.onShareAppMessage()
  }
})

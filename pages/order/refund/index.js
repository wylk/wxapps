var t = getApp(),
  e = t.requirejs("core"),
  a = t.requirejs("biz/order");
Page({
  data: {
    code: 1,
    tempFilePaths: "",
    delete: "",
    rtypeArr: ["退款(仅退款不退货)", "退货退款", "换货"],
    rtypeArrText: ["退款", "退款", "换货"],
    rtypeIndex: 1,
    reasonArr: ["不想要了", "卖家缺货", "拍错了/订单信息错误", "其它"],
    reasonIndex: 0,
    images: [],
    imgs: [],
    array: [],
    index: 0,
    type_arr: [],
    indx:4,
    pigcms_id: '',
    order_no: ''

  },
  formSubmit: function(s) {
    var t = this;
    console.log('form发生了submit事件，携带数据为：', s.detail.value);
    if(s.detail.value.phone.length == 0){
       wx.showToast({
         title: '号码不能为空',
         image: "/static/images/error.png",
         duration: 2000
       })
      return;
    }
    // var pattern1 = /^1[34578]\d{9}$/
    var regNum=new RegExp('1[34578][0-9]{9}','g');
    if(!regNum.exec(s.detail.value.phone)){
      wx.showToast({
         title: '号码格式错误',
         image: "/static/images/error.png",
         duration: 2000
       })
      return;
    }
    if(s.detail.value.content.length == 0){
       wx.showToast({
         title: '退货说明不为空',
         image: "/static/images/error.png",
         duration: 2000
       })
      return;
    }
    var postData = {phone:s.detail.value.phone};
    postData.content = s.detail.value.content;
    postData.pigcms_id = t.data.pigcms_id;
    postData.type = t.data.indx+1;
    postData.number = t.data.index+1;
    postData.images = t.data.imgs;
    postData.order_no = t.data.order_no;
    postData.sign = 1;
    console.log(postData);
    // return;
    e.post('order/return_apply',postData,function(res){
      console.log(res);
      if(res.err_code == 0){
        console.log(res.err_msg);
       /* wx.showModal({
          title: '提示',
          content: res.err_msg,
          showCancel: false,
          success: function(re) {
            if (re.confirm) {
                 wx.navigateTo({
                  url: '/pages/order/index?status='+that.data.status
                })
            }
          }
        })*/
      }else{
        console.log(res.err_msg);
       /* wx.showModal({
          title: '提示',
          content: res.err_msg,
          showCancel: false,
          success: function(re) {
            if (re.confirm) {
                 wx.navigateTo({
                  url: '/pages/order/index?status='+that.data.status
                })
            }
          }
        })*/
      }
    })
  },
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  bindPickerChange1: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      indx: e.detail.value
    })

  },
  upload1: function(v){
    var a = this,
      i = e.data(v),
      s = i.type,
      r = a.data.images,
      n = a.data.imgs,
      o = i.index;
     "image" == s ?  wx.chooseImage({
      success: function(res) {
        var tempFilePaths = res.tempFilePaths
        //console.log(tempFilePaths);
        var h = t.getCache("userinfo");
        var u = t.getCache("mid");
        wx.uploadFile({
          url: 'https://mall.epaikj.com/wxapp.php?c=order&a=upload', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          formData:{
            'openid': h.openid,
            'mid': u.mid
          },
          success: function(res){
            var data = res.data;
            console.log(data);
            // console.log(typeof data);
            var obj = JSON.parse(data);
            console.log(obj.err_msg.file);
            data.err_code ? (e.toast(obj.err_msg, "loading"), wx.redirectTo({
        url: "pages/order/index"})) : r.push(obj.err_msg.id),n.push(obj.err_msg.file),a.setData({images: r,imgs: n})
            console.log(a.data.images);
            console.log(a.data.imgs);
          }
        })
      }
    }) : "image-remove" == s ? (r.splice(o, 1), n.splice(o, 1), a.setData({
      images: r,
      imgs: n
    })) : "image-preview" == s && wx.previewImage({
      current: n[o],
      urls: n
    })
  },
  onLoad: function (e) {
    this.setData({
      options: e
    }),
      t.url(e),
      this.get_list()
  },
  get_list: function () {
    var t = this;
    t.setData({
      pigcms_id: t.data.options.id,
      order_no: t.data.options.orderno
    })
   /* var pigcms_id = t.data.options.id;
    var order_no = t.data.options.orderno;*/
    console.log(t.data.pigcms_id);
    console.log(t.data.order_no);
    e.get("order/return_apply",{pigcms_id:t.data.pigcms_id,order_no:t.data.order_no}, function (a) {
      console.log(a);

        0 == a.err_code ? ((a.rtypeArr = ["退款(仅退款不退货)"]),a.refund=a.err_msg,a.show = true, t.setData(a)) : e.toast(a.err_msg, "loading")
          t.setData({
            array: a.err_msg.num_list,
            type_arr: a.err_msg.type_arr
          })
        console.log(t.data.type_arr);
    /*  0 == a.err_code ? (a.order.status < 2 && (a.rtypeArr = ["退款(仅退款不退货)"]), a.show = true, t.setData(a)) : e.toast(a.err_msg, "loading")*/
    })
  },
  submit: function () {
    var t = {
      id: this.data.options.id,
      rtype: this.data.rtypeIndex,
      reason: this.data.reasonArr[this.data.reasonIndex],
      content: this.data.content,
      price: this.data.price,
      images: this.data.images
    };
    e.post("order/refund/submit", t, function (t) {
      0 == t.error ? wx.navigateBack() : e.toast(t.message, "loading")
    }, true)
  },
  change: function (t) {
    var a = e.data(t).name,
      i = {};
    i[a] = t.detail.value,
      this.setData(i)
  },
  upload: function (t) {
    var a = this,
      i = e.data(t),
      s = i.type,
      r = a.data.images,
      n = a.data.imgs,
      o = i.index;
    "image" == s ? e.upload(function (t) {
      console.log(t);
      r.push(t.filename),
        n.push(t.url),
        a.setData({
          images: r,
          imgs: n
        })
    }) : "image-remove" == s ? (r.splice(o, 1), n.splice(o, 1), a.setData({
      images: r,
      imgs: n
    })) : "image-preview" == s && wx.previewImage({
      current: n[o],
      urls: n
    })
  },
  toggle: function (t) {
    var a = e.pdata(t),
      i = a.id;
    i = 0 == i || void 0 === i ? 1 : 0,
      this.setData({
        code: i
      })
  },
  edit: function (t) {
    this.setData({
      "order.refundstate": 0
    })
  },
  refundcancel: function (t) {
    a.refundcancel(this.data.options.id, function () {
      wx.navigateBack()
    })
  }
})

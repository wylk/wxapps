//index.js
var t = getApp(),
  a = t.requirejs("core"),
  e = (t.requirejs("icons"), t.requirejs("wxParse/wxParse"));
Page({
  data: {
    route: "home",
    icons: t.requirejs("icons"),
    shop: {},
    showModal: false,
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 500,
    circular: true,
    storeRecommand: [],
    total: 0,
    page: 1,
    loaded: false,
    loading: true,
    indicatorDotsHot: false,
    autoplayHot: true,
    intervalHot: 5000,
    durationHOt: 1000,
    circularHot: true,
    inputdata: {},
    hotimg: "/static/images/hotdot.jpg",
    notification: "/static/images/notification.png",
    mode: 'aspectFill',
    src: {},
    text: {},
    getShopMsg: []
  },
  showDialogBtn: function (i) {
    i.setData({
      showModal: true
    })
  },
  preventTouchMove: function (i) {
    console.log(121);
  },
  /**
   * 隐藏模态对话框
   */
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    this.hideModal();
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function () {
    var ts = this;
    var data = {}
    data.password = this.data.inputdata.password;
    data.tel = this.data.inputdata.tel;
    //data.userinfo = t.getCache("userinfo");
    //console.log(data);return;
    !data.tel || !data.password || a.get('public/binding_user', data, function (re) {
      if (re.error == 0) {
        ts.hideModal();
      }else{
        a.alert(re.msg);
      }
    })
  },
  is_tel: function (t) {
    return (/^1[34578]\d{9}$/.test(t));
  },
  inputChange: function (i) {
    var val = i.detail.value;
    var add = 1;
    if (i.currentTarget.id == 'tel') {
      add = this.is_tel(val) || void a.alert('手机号码格式不正确');

    } else {
      add = val.length >= 6 || void a.alert('密码不能少于6位');
    }

    add && (this.data.inputdata[i.currentTarget.id] = val);
  },
  getUser: function () {
    var ss = t.getCache("userinfo");
    console.log(ss);
    var tt = this;
    a.get('public/getUser', {}, function (i) {
      i.error == 1 && tt.showDialogBtn(tt);
    })
  },
  getShopMsg: function () {
    var tt = this;
    a.get("test/getshop_info", {}, function (a) {
      a.list || (a.list = []),
        typeof a.list === "object" && (tt.setData({
          getShopMsg: a.list,
          //getShopMsg: tt.data.getShopMsg.concat(a.list),
          text: a.list.shop_name || "店名未设置",
          src: a.list.shop_logo || "http://image-yp.test.upcdn.net/images/000/000/090/201712/5a3396bf1f5da.jpg"
        }))
    })
  },
  getRecommand: function () {
    var t = this;
    a.get("test/getProduct", {
      page: t.data.page
    }, function (a) {
      t.setData({
        loading: false,
        total: a.total,
        show: true
      }),
        a.list || (a.list = []),
        typeof a.list === "object" && (t.setData({
          storeRecommand: a.list,
          // storeRecommand: t.data.storeRecommand.concat(a.list),
          page: a.page + 1
        }), a.list.length < a.pagesize && (e.loaded = true))
    })
  },
  onLoad: function (a) {
    t.url(a)
  },
  onShow: function () {
    this.getRecommand(),
      this.getShopMsg();
    this.getUser();
  }
})
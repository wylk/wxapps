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
    hotimg: "/static/images/hotdot.jpg",
    notification: "/static/images/notification.png",
    mode: 'aspectFill',
    src: {},
    text: {},
    getShopMsg: []
  }, 
  showDialogBtn: function () {
    this.setData({
      showModal: true
    })
  },
  preventTouchMove: function () {
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
    console.log(234)
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function () {
    this.hideModal();
  },
  getShopMsg: function(){
    var tt = this;
    a.get("test/getshop_info",{},function(a){
      a.list || (a.list = []),
      typeof a.list === "object"  && (tt.setData({
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
         typeof a.list === "object"  && (t.setData({
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
  }
})
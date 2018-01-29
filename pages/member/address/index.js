var t = getApp(),
  e = t.requirejs("core");
Page({
  data: {
    loaded: !1,
    list: []
  },
  onLoad: function (e) {
    t.url(e)
  },
  onShow: function () {
    this.getList()
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
  getList: function () {
    var t = this;
    e.get("address/all", {}, function (e) {
      console.log(e);
      t.setData({
        loaded: !0,
        list: e.err_msg,
        show: !0
      })
    })
  },
  setDefault: function (t) {
    var s = this,
      i = e.pdata(t).id;

    s.setData({
      loaded: !1
    }),
      e.get("address/set_default", {
        address_id: i
      }, function (t) {
        if(t.err_code == 0){
          e.toast(t.err_msg),
            s.getList()
        }else{
          e.toast(t.err_msg),
           s.getList()
        }
      })
  },
  deleteItem: function (t) {
    var s = this,
      i = e.pdata(t).id;
    console.log(i);
    e.confirm("删除后无法恢复, 确认要删除吗 ?", function () {
      s.setData({
        loaded: !1
      }),
        e.get("address/delete", {
          address_id: i
        }, function (t) {
          if(t.err_code == 0){
            e.toast(t.err_msg),
              s.getList()
          }else{
             e.toast(t.err_msg),
              s.getList()
          }
        })
    })
  }
})

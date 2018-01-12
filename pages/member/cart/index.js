// pages/member/cart/index.js
var t = getApp(),
  e = t.requirejs("core"),
  i = t.requirejs("foxui"),
  a = t.requirejs("jquery");
Page({
  data: {
    route: "cart",
    icons: t.requirejs("icons"),
    list: !1,
    checked:!1,
    editischecked: !1,
    empty:!1,
    radio:!1,
    all:!1,
    edit_list: []
  },
  onLoad: function (e) {
    t.url(e)
  },
  onShow: function () {
    this.get_cart()
  },
  get_cart: function () {
    var t;
      i = this
    e.get("cart/get_cart", {}, function (e) {
      t = {
        show: !0,
        empty: e.error || !1,
        list: e.msg || !1,
        checked: !1,
        radio: 1,
        all: !1,
        totalprice: '0.00',
      };
      i.setData(t);
    })
  },
  allChdeck: function(){
    var  carts = this.data.list;
    for (var i = 0; i < carts.length; i++) {
        carts[i].checked = !1;
    }
    return carts;
  },
  edit: function (t) {
    var i,
      s = e.data(t),
      c = this;
      console.log(s.action);
    switch (s.action) {
      case "edit":
        var carts = this.allChdeck();
        this.setData({
          edit: !0,
          list: carts,
          totalprice: '0.00',
          all: !1
        });
        
        break;
      case "complete":
          var carts = this.allChdeck();
          this.setData({
            edit: !1,
            list: carts,
            totalprice: '0.00',
            all: !1            
          });
        break;
      case "delete":
        var id = this.checked_allgoods();
        console.log(id);
        !this.data.editischecked ||  e.confirm("是否确认删除该商品?", function () {
            e.post("cart/remove", {
                ids: id
            }, function (t) {
                if(t.error == 0){
                    e.alert(t.msg);
                }else{
                    e.alert(t.msg);
                }
                c.get_cart()
            });
        });
        break;
      case "pay":
        var id = this.checked_allgoods();
        console.log(id);
        !this.data.total || e.post("cart/pay", {
                ids: id
            }, function (t) {
                if(t.error == 0){
                    e.alert(t.msg);
                    /*wx.navigateTo({
                      url: "/pages/order/create/index"
                    }) */                   
                }else{
                    e.alert(t.msg);
                }
                //c.get_cart()
        });        
        
    }
  },
  checked_allgoods: function(){
    var list = this.data.list,
    arr = '';
    for(var i = 0; i < list.length; i++){
        if(list[i].checked){
            arr += list[i].pigcms_id+',';
        }

    }
    return arr  || false;
  },
  number: function (t) {
    var a = this,
      s = e.pdata(t),
      num = ("minus" == t.target.dataset.action)? (parseFloat(s.num) - 1):(parseFloat(s.num) + 1);
      num < 1 || s.num == s.max || e.post("cart/update", {
      id: s.id,
      skuId: s.skuid,
      num: num
    }, function (t) {
      a.get_cart()
    })
  },
  bindCheckbox: function(e){
    
    var index = parseInt(e.currentTarget.dataset.index),
        carts = this.data.list,
        totals = 0,
        num = 0,
        all = !0,
        checked = carts[index].checked; 
        carts[index].checked = !checked;

        for (var i = 0; i < carts.length; i++) {
            if(carts[i].checked){
                totals += (parseFloat(carts[i].price) * parseFloat(carts[i].pro_num));
                num += 1;
            }
        }
        
         all = carts.length == num ? 1:!1;
         console.log(num);
        var btn = num > 0 ? 1: !1;
      
       this.setData({
          all: all || !1,
          list: carts || !1,
          total:this.data.edit || btn,
          editischecked:this.data.edit && btn,
          totalprice: totals || 0.00
        });     
  },  
  checkAll: function (t) {
    var all = this.data.all,
        totals = 0
    var carts = this.data.list;
    for (var i = 0; i < carts.length; i++) {
        carts[i].checked = !all;
        totals += parseFloat(carts[i].price) * parseFloat(carts[i].pro_num);
        if(!carts[i].checked)totals = 0.00;
        
    }      
    this.setData({
      all: !all,
      list: carts,
      total:this.data.edit || !all,
      editischecked:this.data.edit && !all,
      totalprice: totals
    });
  },
  url: function (t) {
    var i = e.pdata(t);
    wx.navigateTo({
      url: i.url
    })
  },
  onShareAppMessage: function () {
    return e.onShareAppMessage()
  }
})
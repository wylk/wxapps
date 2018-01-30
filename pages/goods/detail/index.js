var t = getApp(),
  e = t.requirejs("core"),
  a = (t.requirejs("icons"), t.requirejs("foxui")),
  o = t.requirejs("biz/diyform"),
  i = t.requirejs("jquery"),
  s = t.requirejs("wxParse/wxParse"),
  n = 0,
  r = [],
  d = [];
Page({
  data: {
    icons: t.requirejs("icons"),
    goods: {},
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 500,
    circular: true,
    active: "",
    slider: "",
    tempname: "",
    info: "active",
    preselltimeend: "",
    presellsendstatrttime: "",
    advWidth: 0,
    dispatchpriceObj: 0,
    now: parseInt(Date.now() / 1000),
    day: 0,
    hour: 0,
    minute: 0,
    second: 0,
    timer: 0,
    discountTitle: "",
    istime: 1,
    istimeTitle: "",
    params: {},
    total: 1,
    optionid: 0,
    defaults: {
      id: 0,
      merchid: 0
    },
    buyType: "",
    pickerOption: {},
    specsData: {},
    specsTitle: "",
    canBuy: "",
    diyform: {},
    showPicker: false,
    pvalOld: [0, 0, 0],
    pval: [0, 0, 0],
    areas: [],
    noArea: true,
    commentObj: {},
    commentObjTab: 1,
    loading: false,
    commentEmpty: false,
    commentPage: 1,
    commentLevel: "all",
    commentList: [],
    price: "",
    sku: "",
    skuid: "",
    addcart: "",
    send_other: '',
    currentId: ''
  },
  favorite: function (t) {
    var a = this,
      o = t.currentTarget.dataset.isfavorite ? 0 : 1;
    e.get("member/favorite/toggle", {
      id: a.data.options.id,
      isfavorite: o
    }, function (t) {
      t.isfavorite ? a.setData({
        "goods.isfavorite": 1
      }) : a.setData({
        "goods.isfavorite": 0
      })
    })
  },
  goodsTab: function (t) {
    var a = this,
      o = t.currentTarget.dataset.tap;
    if ("info" == o)
      this.setData({
        info: "active",
        para: "",
        comment: ""
      });
    else if ("para" == o)
      this.setData({
        info: "",
        para: "active",
        comment: ""
      });
    else if ("comment" == o) {
      if (a.setData({
        info: "",
        para: "",
        comment: "active"
      }), a.data.commentList.length > 0)
        return void a.setData({
          loading: false
        });
      a.setData({
        loading: true
      }),
        e.get("comment/comment_list", {
          data_id: a.data.options.id,
          type: "PRODUCT",
          page: a.data.commentPage
        }, function (t) {
          var t = t.err_msg;

          t.list.length > 0 ? a.setData({
            loading: false,
            commentList: t.list,
            commentPage: t.max_page
          }) : a.setData({
            loading: false,
            commentEmpty: true
          })
        })
    }
  },
  comentTap: function (t) {
    var a = this,
      o = t.currentTarget.dataset.type,
      i = "";
    1 == o ? i = "all" : 2 == o ? i = "HAO" : 3 == o ? i = "ZHONG" : 4 == o ? i = "CHA" : 5 == o && (i = "IMAGE"),
      o != a.data.commentObjTab && e.get("comment/comment_list", {
        data_id: a.data.options.id,
        type: "PRODUCT",
        page: a.data.commentPage,
        tab: i
      }, function (t) {
        var t = t.err_msg;
        console.log(t.max_page);
        //console.log(t.list.attachment_list.file);
        t.list.length > 0 ? a.setData({
          loading: false,
          commentList: t.list,
          commentPage: t.max_page,
          commentObjTab: o,
          commentEmpty: false
        })
          : a.setData({
            loading: false,
            commentList: t.list,
            commentPage: t.max_page,
            commentObjTab: o,
            commentEmpty: true
          })
      })
  },
  number: function (t) {
    var o = this,
      i = e.pdata(t),
      s = a.number(this, t);
    i.id,
      i.optionid;
    //没有选择规格则不能点击
    if (this.data.pickerOption.product.has_property == 1 && !this.data.sku) {
      /* wx.showToast({
       title: '请选择规格',
       image: "/static/images/error.png",
       duration: 2000
     })*/
      //   wx.showModal({
      //   title: '提示',

      //   content: '请选择规格'
      // })
      return void a.toast(o, "请选择规格");
      // return '0';
    }
    // return '0';
    // console.log(1111);
    // console.log(this.data.sku);
    1 == s && 1 == i.value && "minus" == t.target.dataset.action || i.value == i.max && "plus" == t.target.dataset.action || o.setData({
      total: s
    })
  },
  buyNow: function (t) {
    var i = this,
      s = i.data.optionid,
      r = i.data.diyform;
    if (n > 0 && 0 == s) return void a.toast(i, "请选择规格");
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    e.post("order/add", {
      product_id: i.data.options.id,
      total: t.target.dataset.total,//商品的数量
      sku_id: t.target.dataset.skuid,
      send_other: t.target.dataset.send_other,
      addcart: t.target.dataset.addcart
    }, function (t) {
      wx.hideLoading();
      if (t.err_code == 0) {
        wx.redirectTo({
          url: "/pages/order/pay/index?order_no=" + t.err_msg
        })
      }
    })
  },
  getCart: function (t) {
    var i = this,
      s = i.data.optionid,
      r = i.data.diyform;
    if (n > 0 && 0 == s) return void a.toast(i, "请选择规格");
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    e.post("order/add", {
      product_id: i.data.options.id,
      total: t.target.dataset.total,//商品的数量
      sku_id: t.target.dataset.skuid,
      send_other: t.target.dataset.send_other,
      addcart: t.target.dataset.addcart
    }, function (t) {
      wx.hideLoading();
      if (t.err_code == 0) {
        wx.showModal({
          title: '提示',
          content: t.err_msg,
          cancelText: '返回',
          confirmText: '去购物车',
          confirmColor: "#1aad19",
          success: function (res) {
            if (res.confirm) {
              //跳转
              // console.log(res.confirm);
              // wx.redirectTo({
              //   url: '/pages/member/cart/index'
              // });
              wx.switchTab({
                url: '/pages/member/cart/index'
              })
            } else if (res.cancel) {
              //跳转
              wx.navigateTo({
                url: '/pages/goods/detail/index?id=' + i.data.currentId
              })
            }
          }
        })
      } else {
        wx.showToast({
          title: t.err_msg,
          image: "/static/images/error.png",
          duration: 2000
        })
        return;
      }
    })
  },
  getDetail: function (t) {
    var a = this,
      o = parseInt(Date.now() / 1000);
    a.setData({
      loading: true
    }),
      e.get("goods/index", {
        id: t.id,
        app: "app"
      }, function (t) {
        // console.log(t.goods);s.wxParse("wxParseData", "html", t.goods.content, a, "0"),
        if (s.wxParse("wxParseData", "html", t.goods.product.info, a, "0"), a.setData({
          show: true,
          goods: t.goods,
          send_other: t.goods.product.send_other,
          currentId: t.goods.product.product_id
        }), wx.setNavigationBarTitle({
          title: t.goods.title || "商品详情"
        }), n = t.goods.hasoption, i.isEmptyObject(t.goods.dispatchprice) || "string" == typeof t.goods.dispatchprice ? a.setData({
          dispatchpriceObj: 0
        }) : a.setData({
          dispatchpriceObj: 1
        }), t.goods.isdiscount > 0 && t.goods.isdiscount_time >= o) {
          clearInterval(a.data.timer);
          var r = setInterval(function () {
            a.countDown(0, t.goods.isdiscount_time)
          }, 1000);
          a.setData({
            timer: r
          })
        } else
          a.setData({
            discountTitle: "活动已结束"
          });
        t.goods.comment_data.total > 0 && e.get("comment/comment_list", {
          data_id: a.data.options.id,
          type: "PRODUCT"
        }, function (t) {
          console.log(t.err_msg.max_page);
          a.setData({
            commentObj: t.err_msg
          })
          // console.log(commentObj);
        })
      })
  },
  countDown: function (t, e, a) {
    var now = parseInt(Date.now() / 1000),
      i = t > now ? t : e,
      s = i - now,
      leftsecond = parseInt(s),
      day1 = Math.floor(leftsecond / (60 * 60 * 24)),
      hour = Math.floor((leftsecond - 24 * day1 * 60 * 60) / 3600),
      minute = Math.floor((leftsecond - 24 * day1 * 60 * 60 - 3600 * hour) / 60);
    Math.floor(leftsecond - 24 * day1 * 60 * 60 - 3600 * hour - 60 * minute);
    if (this.setData({
      day: Math.floor(leftsecond / (60 * 60 * 24)),
      hour: Math.floor((leftsecond - 24 * day1 * 60 * 60) / 3600),
      minute: Math.floor((leftsecond - 24 * day1 * 60 * 60 - 3600 * hour) / 60),
      second: Math.floor(leftsecond - 24 * day1 * 60 * 60 - 3600 * hour - 60 * minute)
    }), "istime") {
      var l = "";
      t > now ? l = "距离限时购开始" : t <= now && e > now ? l = "距离限时购结束" : (l = "活动已经结束，下次早点来~", this.setData({
        istime: 0
      })),
        this.setData({
          istimeTitle: l
        })
    }
  },
  cityPicker: function (t) {
    var e = this;
    t.currentTarget.dataset.tap;
    wx.navigateTo({
      url: "/pages/goods/region/index?id=" + e.data.goods.id + "&region=" + e.data.goods.citys
    })
  },//购物弹框
  selectPicker: function (t) {
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    var a = this,
      o = t.currentTarget.dataset.tap,
      i = t.currentTarget.dataset.buytype;
    e.get("goods/info", {
      product_id: a.data.goods.product.product_id
    }, function (t) {
      wx.hideLoading();
      a.setData({
        pickerOption: t.err_msg,
        active: "active",
        slider: "in",
        tempname: "select-picker",
        buyType: i
      });
    })
  },
  for_property_list: function (t) {
    var a = t.target.dataset.idx,
      index = t.target.dataset.index;
    var datas = this.data.pickerOption.property_list[index].values;
    var sku_list = this.data.pickerOption.sku_list;
    var r = [];
    for (var i = 0; i < datas.length; i++) {
      for (var j = 0; j < sku_list.length; j++) {
        if (i == a) {
          r[i] = { id: datas[i].vid },
            r['title'] = datas[i].value,
            r['quantity'] = sku_list[i].quantity,
            r['price'] = sku_list[i].price,
            r['skuid'] = sku_list[i].sku_id
        } else {
          r[i] = { id: !1 }
        }
      }
    }
    return r;
  },
  specsTap: function (t) {
    var r = this.for_property_list(t);
    // console.log(r);
    // console.log(r['price']);
    this.setData({
      specsData: r,
      specsTitle: r['title'],
      price: r['price'],
      sku: r['quantity'],
      skuid: r['skuid']
    });
    // console.log(this.data.sku);
  },
  specsTap1: function (t) {
    var e = this,
      a = t.target.dataset.idx;
    r[a] = {
      id: t.target.dataset.id,
      title: t.target.dataset.title
    };
    var o = "",
      i = "";
    r.forEach(function (t) {
      o += t.title + ";",
        i += t.id + "_"
    }),
      i = i.substring(0, i.length - 1),
      d.forEach(function (a) {
        a.specs == i && (e.setData({
          optionid: a.id,
          "goods.total": a.stock,
          "goods.maxprice": a.marketprice,
          "goods.minprice": a.marketprice
        }), "" != t.target.dataset.thumb && e.setData({
          "goods.thumb": t.target.dataset.thumb
        }), a.stock <= 0 ? e.setData({
          canBuy: "库存不足"
        }) : e.setData({
          canBuy: ""
        }))
      }),
      e.setData({
        specsData: r,
        specsTitle: o
      })
  },
  emptyActive: function () {
    this.setData({
      active: "",
      slider: "out"
    })
  },
  onLoad: function (e) {
    var a = this;
    "" == t.getCache("userinfo") && wx.redirectTo({
      url: "/pages/message/auth/index"
    }),
      a.setData({
        options: e,
        areas: t.getCache("cacheset").areas
      }),
      wx.getSystemInfo({
        success: function (t) {
          a.setData({
            advWidth: t.windowWidth
          })
        }
      }),
      this.getDetail(e)
  },
  onShow: function () {
    r = [],
      d = []
  },
  onChange: function (t) {
    return o.onChange(this, t)
  },
  DiyFormHandler: function (t) {
    return o.DiyFormHandler(this, t)
  },
  selectArea: function (t) {
    return o.selectArea(this, t)
  },
  bindChange: function (t) {
    return o.bindChange(this, t)
  },
  onCancel: function (t) {
    return o.onCancel(this, t)
  },
  onConfirm: function (t) {
    return o.onConfirm(this, t)
  },
  getIndex: function (t, e) {
    return o.getIndex(t, e)
  },
  onShareAppMessage: function () {
    return e.onShareAppMessage("/pages/goods/detail/index?id=" + this.data.options.id)
  }
})
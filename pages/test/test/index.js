var app = getApp(),
  s = app.requirejs("core"),
  a = (app.requirejs("icons"), app.requirejs("foxui")),
  w = app.requirejs("wxValidate"),
  tcity = app.requirejs("citys");
Page({
  data: {
    provinces: [],
    province: "",
    citys: [],
    city: "",
    countys: [],
    county: '',
    value: [0, 0, 0],
    values: [0, 0, 0],
    condition: false,
    location1: {},
    text: "点击定位",
    detail_area: "",
    focus: false,
    inputValue:{},
    address_id: "",
    name: "",
    tel: "",
    address_data: {}
  },
  location: function(){
    var a = this;
      wx.getSetting({
          success: (res) => {
            console.log(res.authSetting['scope.userLocation']);
            if(res.authSetting['scope.userLocation'] == undefined || res.authSetting['scope.userLocation'] != true){
                      wx.getSetting({
                        success(res) {
                            if (!res.authSetting['scope.userLocation']) {
                                wx.authorize({
                                    scope: 'scope.userLocation',
                                    success() {
                                        // 用户已经同意小程序使用获取地理位置功能
                                      wx.chooseLocation({
                                          success: function(res) {
                                            console.log(res);
                                          // var latitude = res.latitude
                                          // var longitude = res.longitude
                                        }
                                      });
                                  }
                                })
                            }
                        }
                    })
            }else{
              //获取授权之后
              wx.chooseLocation({
                  success: function(res) {
                    // console.log(res);
                    a.setData({
                        location1: res,
                        text: "定位完成",
                        detail_area: res.name
                    })

                  // var latitude = res.latitude
                  // var longitude = res.longitude
                }
              });
            }
          }
        })
  },
  bindTextAreaBlur: function(e) {
    console.log(e.detail.value)
  },
  test: function(){
     console.log(this.data.location1);
   },
  bindChange: function(e) {
    //console.log(e);
    var val = e.detail.value
    var t = this.data.values;
    var cityData = this.data.cityData;

    if(val[0] != t[0]){
      console.log('province no ');
      const citys = [];
      const countys = [];

      for (let i = 0 ; i < cityData[val[0]].sub.length; i++) {
        citys.push(cityData[val[0]].sub[i].name)
      }
      for (let i = 0 ; i < cityData[val[0]].sub[0].sub.length; i++) {
        countys.push(cityData[val[0]].sub[0].sub[i].name)
      }

      this.setData({
        province: this.data.provinces[val[0]],
        city: cityData[val[0]].sub[0].name,
        citys:citys,
        county: cityData[val[0]].sub[0].sub[0].name,
        countys:countys,
        values: val,
        value:[val[0],0,0]
      })
      console.log(this.data.province);
      console.log(this.data.city);
      console.log(this.data.county);
      return;
    }
    if(val[1] != t[1]){
      console.log('city no');
      const countys = [];

      for (let i = 0 ; i < cityData[val[0]].sub[val[1]].sub.length; i++) {
        countys.push(cityData[val[0]].sub[val[1]].sub[i].name)
      }

      this.setData({
        city: this.data.citys[val[1]],
        county: cityData[val[0]].sub[val[1]].sub[0].name,
        countys:countys,
        values: val,
        value:[val[0],val[1],0]
      })
      return;
    }
    if(val[2] != t[2]){
      console.log('county no');
      this.setData({
        county: this.data.countys[val[2]],
        values: val
      })
      return;
    }


  },
  open:function(){
    this.setData({
      condition:!this.data.condition
    })
  },
  onLoad: function (f) {
    console.log("onLoad");
    console.log(f);
    var that = this;
    if(f.address_id){
      that.setData({
        address_id: f.address_id
      })
    }
  if(that.data.address_id){
      wx.setNavigationBarTitle({
        title: "修改地址"
      })
    }
    tcity.init(that);

    var cityData = that.data.cityData;


    const provinces = [];
    const citys = [];
    const countys = [];

    for(let i=0;i<cityData.length;i++){
      provinces.push(cityData[i].name);
    }
    console.log('省份完成');
    for (let i = 0 ; i < cityData[0].sub.length; i++) {
      citys.push(cityData[0].sub[i].name)
    }
    console.log('city完成');
    for (let i = 0 ; i < cityData[0].sub[0].sub.length; i++) {
      countys.push(cityData[0].sub[0].sub[i].name)
    }

    that.setData({
      'provinces': provinces,
      'citys':citys,
      'countys':countys,
      'province':cityData[0].name,
      'city':cityData[0].sub[0].name,
      'county':cityData[0].sub[0].sub[0].name
    })
    //地址修改
    s.get('address/address_data',{address_id:that.data.address_id},function(res){
        if(res.err_code == 0){
          var t = res.err_msg;
          that.setData({
            address_data: res.err_msg,
            name: t.name,
            tel: t.tel,
            detail_area: t.address,
            province: t.province_txt,
            city: t.city_txt,
            county: t.area_txt
          })
          console.log(that.data.address_data);
        }else{
            wx.showToast({
             title: res.err_msg,
             image: "/static/images/error.png",
             duration: 2000
           })
          return;
        }
    });
    console.log('初始化完成');

  },
  formSubmit: function(e) {
    //console.log('form发生了submit事件，携带数据为：', e.detail.value);
    if(e.detail.value.user_name.length == 0){
       wx.showToast({
         title: '姓名不能为空',
         image: "/static/images/error.png",
         duration: 2000
       })
      return;
    }
    if(e.detail.value.tel.length == 0){
       wx.showToast({
         title: '号码不能为空',
         image: "/static/images/error.png",
         duration: 2000
       })
      return;
    }
    // var pattern1 = /^1[34578]\d{9}$/
    var regNum=new RegExp('1[34578][0-9]{9}','g');
    if(!regNum.exec(e.detail.value.tel)){
      wx.showToast({
         title: '号码格式错误',
         image: "/static/images/error.png",
         duration: 2000
       })
      return;
    }
    if(e.detail.value.address.length == 0){
       wx.showToast({
         title: '点击地图定位',
         image: "/static/images/error.png",
         duration: 2000
       })
      return;
    }

   /* console.log('form发生了submit事件，携带数据为：', e.detail.value);
    console.log(this.data.province);*/
    var postData = {name:e.detail.value.user_name};
    postData.tel = e.detail.value.tel;
    postData.address = e.detail.value.address;
    postData.province = this.data.province;
    postData.city = this.data.city;
    postData.area = this.data.county;
    postData.zipcode = '000000';
    postData.lng = this.data.location1.longitude || this.data.address_data.lng;
    postData.lat = this.data.location1.latitude || this.data.address_data.lat;
    postData.address_id = this.data.address_id || 0;
    console.log(postData);
    // return;
    s.post("address/save",postData,function(res){
        if(res.err_code==0){
          console.log(res.err_msg);
           wx.showToast({
           title: '操作成功',
           icon: 'success',
           duration: 2000
         })
         /* wx.showModal({
          title: '提示',
          content: '添加成功',
          showCancel: false,
          success: function(re) {
            if (re.confirm) {
                 wx.navigateTo({
                  url: '/pages/member/address/index
                })
            }
          }
        })*/
        }

    })

  },
  formReset: function() {
    console.log('form发生了reset事件')
  },
  onShareAppMessage: function(){
  }
})

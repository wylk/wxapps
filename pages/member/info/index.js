var t = getApp(),
  e = t.requirejs("core");
Page({
  data: {
    icons: t.requirejs("icons"),
    member: {},
    showModalPassword: 1,
    time: '获取验证码',
    currentTime:60,
    inputData:{},
    disabled: !1,
    pass: '',
  },
  onLoad: function (e) {
  },
  onShow: function () {
    this.getInfo()
  },
  getInfo: function () {
    var t = this;
    e.get("public/userinfo", {}, function (e) {
      var a = e.msg,
        i = {
          member: a,
          show: true
        };
      t.setData(i)
    })
  },
  listenerCancel: function () {
    this.setData({
      showModalPassword: 1
    })
  },
  deitPassword: function (i) {
    clearInterval(this.data.interval);
    this.setData({
      showModalPassword: !1,
      passType : i.target.id,
      pass: '',
      time: '获取验证码',
      currentTime:60,
      code:!1,
      disabled: !1,
    })
  },
  getCode: function (){
    var tt = this,
      tel = tt.data.member.phone;
    tt.data.disabled || e.get('public/message',{tel: tel},function(i){
      if(i.error == 0){
        e.alert(i.msg);
        tt.setData({
          code:i.code,
          disabled:true,
        })
        tt.countDownetCode(tt);
      }else{
        e.alert(i.msg);
      }
    })

  },
  countDownetCode: function (that) {

    var currentTime = that.data.currentTime;
    that.setData({
      time: currentTime + '秒'
    })
    var interval = setInterval(function () {
      that.setData({
        time: (currentTime - 1) +
        '秒'
      })
      currentTime--;
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          time: '重新获取',
          currentTime: 60,
          disabled: false
        })
      }
    }, 1000);
    that.setData({
      interval: interval
    })
  },
  inputs: function (i){
    this.data.inputData[i.target.id] = i.detail.value;
  },
  edit_password :function (){
    var tt = this,
    data = tt.data.inputData;
    if((data.paw1).length < 5){
      e.alert('输入密码不能少于6个字符'); return;
    }
    if (data.paw1 != data.paw2){
      e.alert('输入密码不一致'); return;
    }
    if (data.code != tt.data.code || !tt.data.code){
      e.alert('输入验证码不对'); return;
    }
    var updata ={}
    updata.passType =  tt.data.passType;
    updata.password = data.paw1;
    updata.code = data.code;
    wx.showLoading({
      title: '操作中',
      mask: true
    });
    e.post("public/edidPassword",updata, function (re) {
      wx.hideLoading();
      if(re.error == 0){
        e.alert(re.msg);
        tt.setData({
          showModalPassword: 1
        })
        tt.onLoad();
      }else{
        e.alert(re.msg);
      }
    });
  },
  onShareAppMessage: function(){
  }
})

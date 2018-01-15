var t = getApp(),
  a = t.requirejs("core");
  Page({
        data: {
        imgUrls: [
          'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
          'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
          'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
        ],
        indicatorDots: true,
        autoplay: true,
        interval: 5000,
        duration: 1000,
        circular: true
      },
      formSubmit: function(e) {
        var d = e.detail.value;
        console.log(d.checkbox[0])
        a.post("test/getData", {switch:d.switch,slider:d.slider,input:d.input,radiogroup:d.radiogroup,checkbox:d.checkbox[0]}, function (o) {
          console.log(o.error);//o.error ? a.alert(o.msg); : o.error ? a.alert(o.msg); :
            o.error ? a.alert(o.msg) : a.alert(o.msg);setTimeout(function () {
              wx.redirectTo({
                url: "/pages/test/test/success"
            })
          },3000)
            console.log('form发生了submit事件，携带数据为：', e.detail.value)
        })
      },
      formReset: function() {
        console.log('form发生了reset事件')
      }
  })
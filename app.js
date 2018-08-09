//app.js

// 初始化 Bmob SDK
var Bmob = require('utils/bmob.js');
Bmob.initialize("856e76c0738dd1f815aca6afa211e914", "249743cbc1d98ae66a7e847a20ce7041");

App({
  onLaunch: function () {
    
    // 获取用户信息
    wx.getSetting({
      success: res => {

        if (!res.authSetting['scope.userInfo']) {
          wx.authorize({
            scope: 'scope.userInfo',
          })
        }

        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
          })
        }
        this.getUserInfoFunc();
      }
    })
  },
  globalData: {
    userInfo: null,
    smokes: [],
    arecas: [],
    wines: [],
    goods: [],
    globalOrder: [],

  },
  getUserInfoFunc: function() {
    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    wx.getUserInfo({
      success: res => {
        // 可以将 res 发送给后台解码出 unionId
        this.globalData.userInfo = res.userInfo
        
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        if (this.userInfoReadyCallback) {
          this.userInfoReadyCallback(res)
        }
      }
    })
  }

})
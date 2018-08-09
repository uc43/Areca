//index.js

var Bmob = require('../../utils/bmob.js');
//获取应用实例
const app = getApp()

var self;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
      {
        id: 'areca',
        name: '槟榔',
        img: '/image/areca-areca.png'
      },
      {
        id: 'smoke',
        name: '香烟',
        img: '/image/areca-smoking.png'
      },
      {
        id: 'wine',
        name: '美酒',
        img: '/image/areca-wine.png'
      },
    ],
    // 购物车透明属性
    cartOpacity: 0.5,
    // 购物车是否可以点击属性
    cartPointerEvents: 'none',
    // 头像
    headimg: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1524574296601&di=5bb32b288e6d473baaf59575cce78172&imgtype=0&src=http%3A%2F%2Fpic.58pic.com%2F58pic%2F12%2F81%2F50%2F20G58PICUSr.jpg',
    // 昵称
    nickName: '游客',
    orderNum: 0,

  },
  // 购物车事件
  cartAction: function() {
    wx.navigateTo({
      url: '../cart/cart?title=cart',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    self = this;

    var Goods = Bmob.Object.extend("goods");
    var goods = new Bmob.Query(Goods);
    // 查询商品所有数据
    goods.find({
      success: function (results) {
        getApp().globalData.goods = results;
      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
        wx.showToast({
          title: '数据出错',
          icon: 'none'
        })
      }
    });

    app.userInfoReadyCallback = res => {
      this.data.headimg = res.userInfo['avatarUrl'];
      this.data.nickName = res.userInfo['nickName'];
      this.setData({
        headimg: this.data.headimg,
        nickName: this.data.nickName
      })

      this.findNickNameTabel();
    }
    
    
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 这里是全局数据
    var tmpOrder = getApp().globalData.globalOrder;
    if (tmpOrder.length == 0) {
      // 没有订单
      this.data.cartPointerEvents = 'none';
      this.data.cartOpacity = 0.5;
      this.setData({
        cartPointerEvents: this.data.cartPointerEvents,
        cartOpacity: this.data.cartOpacity
      })
    }else {
      this.data.cartPointerEvents = 'auto';
      this.data.cartOpacity = 1;
      this.setData({
        cartPointerEvents: this.data.cartPointerEvents,
        cartOpacity: this.data.cartOpacity
      })
    }

    if (this.data.nickName) {
      this.findNickNameTabel();
    }
    
  },

  findNickNameTabel: function() {
    var Order = Bmob.Object.extend("order");
    var order = new Bmob.Query(Order);
    order.equalTo("nickName", this.data.nickName);
    // 查询 nickName 所有数据
    order.find({
      success: function (results) {

        self.setData({
          orderNum: results.length
        })
      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    });
  }
  

})
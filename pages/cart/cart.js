
var Bmob = require('../../utils/bmob.js');

// 腾讯地图SDK
var QQMapWX = require('../../utils/qqmap-wx-jssdk1.0/qqmap-wx-jssdk.js');
var qqmap;

var self;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    phone: '',
    site: '',
    cartOrder: [],
    total: 0,
    distance: '',
    distanceprice: 0
  },
  // 名字input
  inputNameAction: function(e) {
    this.setData({
      name: e.detail.value
    })
  },
  // 电话号码input
  inputPhoneAction: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  // 收货地址input
  inputSiteAction: function (e) {
    wx.chooseLocation({
      success: function (res) {
        if (res.errMsg == "chooseLocation:ok") {
          getApp().globalData.location = res
          self.setData({
            site: res.name
          })
          // 调用接口
          qqmap.calculateDistance({
            mode: 'driving',
            'from': {
              latitude: res.latitude,
              longitude: res.longitude
            },
            to: [{
              latitude: 19.99125,
              longitude: 110.343200
            }],
            success: function (res) {
              
              var distan = res.result.elements[0]['distance'] / 1000;
              
              if (distan < 3) {
                self.data.distanceprice = 5;
              }else if (distan > 3 && distan < 7) {
                self.data.distanceprice = 10;
              }else if (distan > 7 && distan < 12) {
                self.data.distanceprice = 20;
              }else {
                wx.showToast({
                  title: '抱歉，不在服务范围内',
                  icon: 'none'
                })
              }

              self.data.distance = '=> 距离门店' + distan + '公里' + '配送费: ' + self.data.distanceprice + '元';

              self.setData({ 
                distance: self.data.distance,
                distanceprice: self.data.distanceprice
                })

              self.getTotal();
            },
            fail: function (res) {
              wx.showToast({
                title: '获取距离失败',
                icon: 'icon'
              })
            }
          });    
        }
      },
    })
  },
  // 配送规则
  helpAction: function() {
    wx.navigateTo({
      url: '../distribution/distribution?title=distribution',
    })
  },

  // 删除商品
  deleteGoodsAction: function(e) {
    var idx = e.currentTarget.dataset.index;
    wx.showModal({
      title: '确定删除该商品？',
      content: '',
      success: function(res) {
        if (res.confirm){
          
          getApp().globalData.globalOrder.splice(idx, 1);
          self.setData({
            cartOrder: getApp().globalData.globalOrder,
          })
          self.getTotal();
        }
      }
    })
  },
  // 计算总价
  getTotal: function() {
    var orders = getApp().globalData.globalOrder;
    if (orders.length>0){
      this.data.total = this.data.distanceprice;
      for (let i = 0; i < orders.length; i++) {
        var obj = orders[i];
        var price = parseInt(obj['price'].slice(0, obj['price'].length - 2));
        this.data.total += price * obj['num'];
      }

      this.setData({
        total: this.data.total,
      })
    }
    
  },
  // 结算
  clearingAction: function() {

    if (this.verify()) {

      var Order = Bmob.Object.extend("order");
      var order = new Order();
      // 添加订单数据，第一个入口参数是Json数据
      order.save({
        nickName: getApp().globalData.userInfo['nickName'],
        name: self.data.name,
        phone: self.data.phone,
        site: self.data.site,
        order: self.data.cartOrder,
        distanceprice: self.data.distanceprice
      }, {
          success: function (result) {
            // 添加成功
            console.log(1);
          },
          error: function (result, error) {
            // 添加失败
            console.log(error);
          }
        });

      var Person = Bmob.Object.extend("person");
      var person = new Person();
      // 添加用户数据
      person.save({
        nickName: getApp().globalData.userInfo['nickName'],
        name: self.data.name,
        phone: self.data.phone,
        site: self.data.site,
        distance: self.data.distance,
      }, {
          success: function (result) {
            // 添加成功
            console.log(2);
          },
          error: function (result, error) {
            // 添加失败
            console.log(error);
          }
        });

      wx.showToast({
        title: '购买成功',
        icon: 'none'
      })
    }else {
      
    }
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    self = this;


    // 这里是全局数据
    this.setData({
      cartOrder: getApp().globalData.globalOrder,
      name: getApp().globalData.userInfo['nickName']
    })

    this.getTotal();

    // 实例化API核心类
    qqmap = new QQMapWX({
      key: 'MGHBZ-WYTCJ-4G5FF-KQ5TM-VPLEK-XUBKR' // 必填
    });

    
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  

    var Person = Bmob.Object.extend("person");
    var person = new Bmob.Query(Person);
    person.equalTo("nickName", getApp().globalData.userInfo['nickName']);
    // 查询 nickName 所有数据
    person.find({
      success: function (results) {
        // 数据库有该用户就提取出信息
        if (results.length > 0) {
          var tmp = results[0]['attributes'];
          self.data.name = tmp['name'];
          self.data.phone = tmp['phone'];
          self.data.site = tmp['site'];
          self.data.distance = tmp['distance'];
          self.setData({
            name: self.data.name,
            phone: self.data.phone,
            site: self.data.site,
            distance: self.data.distance
          })
        }
      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    });
  },
  // 验证
  verify: function() {
    if (this.data.cartOrder.length != 0) {
      if (this.data.name == '') {
        wx.showToast({
          title: '收货人名字不能为空',
          icon: 'none'
        })
        return false;
      } else if (this.data.phone == '') {
        wx.showToast({
          title: ' 收货人电话号码不能为空 ',
          icon: 'none'
        })
        return false;
      } else if (!this.isPoneAvailable(this.data.phone)) {
        wx.showToast({
          title: ' 输入正确的手机号码 ',
          icon: 'none'
        })
      } else if (this.data.site == '') {
        wx.showToast({
          title: ' 输入收货地址 ',
          icon: 'none'
        })
        return false;
      } else {
        return true;
      }
    } else {
      wx.showToast({
        title: ' 没有订单，请重新选购 ',
        icon: 'none'
      })
      return false;
    }

     
  },
  // 判断是否为手机号  
  isPoneAvailable: function (pone) {
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!myreg.test(pone)) {
      return false;
    } else {
      return true;
    }
  }
})

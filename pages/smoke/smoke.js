const app = getApp()

Page({
  data: {
    list: [],
    // 按钮状态
    disabled: true,
    // 订单
    order: {},

    title: '',
    total: 0
  },

  onLoad: function(option) {
    for (var i = 0; i < getApp().globalData.goods.length; i++) {
      var object = getApp().globalData.goods[i];
      if (object.get('type') == option.id) {
        var dic = object['attributes'];
        dic['minusStatus'] = 'disabled';
        dic['num'] = 0;
        this.data.list.push(object['attributes']);
      }

    }
    // 模拟数据
    // switch (option.id) {
    //   case 'smoke':
    //     this.data.list = [
    //       {
    //         id: 'furongwang',
    //         name: '芙蓉王',
    //         img: '/image/areca-smoke.jpg',
    //         price: '25/包',
    //         sum: '5',
    //         num: 0,
    //         // 使用data数据设置样式名
    //         minusStatus: 'disabled',
    //       },
    //       {
    //         id: 'yuxi',
    //         name: '玉溪',
    //         img: '/image/areca-yuxi.jpg',
    //         price: '23/包',
    //         sum: '6',
    //         num: 0,
    //         // 使用data数据设置样式名
    //         minusStatus: 'disabled',
    //       },
    //       {
    //         id: 'zhonghua-y',
    //         name: '中华(硬)',
    //         img: '/image/areca-zhonghua-ying.jpg',
    //         price: '45/包',
    //         sum: '7',
    //         num: 0,
    //         // 使用data数据设置样式名
    //         minusStatus: 'disabled',
    //       },
    //       {
    //         id: 'zhonghua-r',
    //         name: '中华(软)',
    //         img: '/image/areca-zhonghua-ruan.jpg',
    //         price: '65/包',
    //         sum: '8',
    //         num: 0,
    //         // 使用data数据设置样式名
    //         minusStatus: 'disabled',
    //       },
    //     ];
    //     break;
    //   case 'wine':
    //     this.data.list = [
    //       {
    //         id: 'haimagong',
    //         name: '海马贡酒',
    //         img: '/image/areca-liquor.jpg',
    //         price: '10/瓶',
    //         sum: '50',
    //         num: 0,
    //         // 使用data数据设置样式名
    //         minusStatus: 'disabled',
    //       },
    //     ];
    //     break;
    //   case 'areca':
    //     this.data.list = [
    //       {
    //         id: 'areca-olive',
    //         name: '青口槟榔',
    //         img: '/image/areca-olive.jpg',
    //         price: '20/包',
    //         sum: '100',
    //         num: 0,
    //         // 使用data数据设置样式名
    //         minusStatus: 'disabled',
    //       },
    //       {
    //         id: 'kouweiwang',
    //         name: '口味王',
    //         img: '/image/areca-dried.jpg',
    //         price: '20/包',
    //         sum: '50',
    //         num: 0,
    //         // 使用data数据设置样式名
    //         minusStatus: 'disabled',
    //       },
    //     ];
    //     break;
    //   default:
    //     break;
    // }

    this.setData({
      list: this.data.list
    })
  },

  /* 点击减号 */  
  bindMinus: function (e) {
    this.setNumber(e, 1);
  },

  /* 点击加号 */
  bindPlus: function (e) {
    this.setNumber(e, 2);
  },

  /* 输入框事件 */
  bindManual: function (e) {
    this.setNumber(e,3);
  },

  // 提交订单
  submitOreder: function() {

    // 全局订单表
    var dict = this.data.order;

    for (let k in dict) {
      app.globalData.globalOrder.push(dict[k]);

      app.globalData.globalOrder = this.union(app.globalData.globalOrder);
      
      setTimeout(function () {

        wx.navigateBack();
      }, 500);
    }
  },

  // 设置 num
  setNumber: function(e, tag) {
    var idx = e.currentTarget.dataset.index;
    var obj = this.data.list[idx];
    switch (tag) {
      case 1:
        if (obj.num > 0) {
          obj.num--;
        }
        break;
      case 2:
        if (obj.num == obj.sum){
          wx.showToast({
            title: '库存不足,请联系商家。',
            icon: 'none'
          })
          return;
        }
        obj.num++;
        break;
      case 3:
        if (parseInt(e.detail.value) > obj.sum) {
          wx.showToast({
            title: '库存不足,请联系商家。',
            icon: 'none'
          })
          return;
        }else {
          obj.num = parseInt(e.detail.value);
        }
        
        break;  
      default:
        break;
    }
    obj.minusStatus = obj.num <= 0 ? 'disabled' : 'normal';
    // this.data.list[idx] = obj;

    // 订单数据存储
    if (obj.num > 0) {
      this.data.order[obj.name] = obj;
    }
    if (obj.num == 0) {
      delete this.data.order[obj.name];
    }
    // 按钮状态控制
    this.data.disabled = JSON.stringify(this.data.order) == '{}';

    this.getTotal();
    
    // 将数值与状态写回  
    this.setData({
      list: this.data.list,
      order: this.data.order,
      disabled: this.data.disabled
    });
  },
  // 计算总价
  getTotal: function () {

    var tmp = [];
    for (var k in this.data.order) {
      
      var obj = this.data.order[k];
      var price = parseInt(obj['price'].slice(0, obj['price'].length - 2));
      tmp.push(price * obj['num']);
    }
    this.data.total = 0;
    for (var idx = 0; idx < tmp.length; idx++) {
      this.data.total += tmp[idx];
    }
    this.setData({
        total: this.data.total,
    })
    

  },
  // 合并重复数据
  union: function(arr) {
    arr = arr || [];
    var tmp = {};
    for(var i = 0, len = arr.length; i<len; i++){
      var obj = arr[i];
      if (obj.name in tmp) {
        tmp[obj.name].num += obj.num;
      } else {
        tmp[obj.name] = obj;
      }
    }
    var result = [];
    for (var key in tmp) {
      result.push(tmp[key]);
    }
    
    return result;
} 
  
})
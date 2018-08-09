// pages/distribution/distribution.js


Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude: 19.99125,
    longitude: 110.343200,
    scale: 19,
    markers: [
      // {latitude: "20.03855", longitude: "110.31846", title: "复兴城",iconPath: "/image/areca-location.png"},
      {latitude: "19.99125",longitude: "110.343200",title: "佳宝花园"}
     
    ]
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var self = this;
    // var markers1 = this.data.markers[0];
    // // var lines1 = this.data.lines[0];
    
    // if (JSON.stringify(getApp().globalData.location) == 'null') {
    //   wx.getLocation({
    //     type: 'wgs84', // wgs84->GPS，gcj02->火星坐标
    //     success: function (res) {
    //       markers1['latitude'] = res.latitude;
    //       markers1['longitude'] = res.longitude;
    //       // lines1['latitude'] = res.latitude;
    //       // lines1['longitude'] = res.longitude;
    //       self.data.markers[0] = markers1;
    //       // self.data.lines[0] = lines1;
    //       self.setData({
    //         latitude: res.latitude,
    //         longitude: res.longitude,
    //         markers: self.data.markers,
    //         // lines: self.data.lines
    //       })
    //     },
    //   })
      
    // }else {
    //   obj['latitude'] = getApp().globalData.location['latitude'];
    //   obj['longitude'] = getApp().globalData.location['longitude'];
    //   self.data.markers[0] = obj;
    //   self.setData({
    //     latitude: getApp().globalData.location['latitude'],
    //     longitude: getApp().globalData.location['longitude'],
    //     markers: self.data.markers
    //   })
      
    // }

    
    // wx.request({
    //   url: 'http://apis.map.qq.com/ws/direction/v1/driving/',
    //   data: {
    //     'from': '20.03855,110.31846',
    //     'to': '19.99125,110.343200',
    //     'key': 'MGHBZ-WYTCJ-4G5FF-KQ5TM-VPLEK-XUBKR'
    //   },
    //   method: 'GET',
    //   success: function(res) {

    //     var polyline = res.data.result.routes[0]['polyline'];
    //     for (var i=0;i<polyline.length;i++) {
    //       polyline[i] = polyline[i - 2] + polyline[i] / 1000000
    //     }
    //     console.log(res.data.result.routes[0]['polyline']);

    //   }
    // })
  },

})
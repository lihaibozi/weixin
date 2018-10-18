//js
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              console.log(res.userInfo)
            }
          })
        }
      } 
    })
  },
  bindGetUserInfo: function (event) {
    var _this = this;
    //使用
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.login({
            success: function (res) {
              var code = res.code;//登录凭证
              if (code) {
                //2、调用获取用户信息接口
                wx.getUserInfo({
                  success: function (res) {
                    //console.log({ encryptedData: res.encryptedData, iv: res.iv, code: code })
                    //3.请求自己的服务器，解密用户信息 获取unionId等加密信息
                    wx.request({
                      url: 'https://jzxcx.bydsfy.com/kin/gh/login/login',//自己的服务接口地址
                      // url: 'http://localhost:8080/kin/gh/login/login',//自己的服务接口地址
                      method: 'post',
                      data: { encryptedData: res.encryptedData, iv: res.iv, code: code },
                      success: function (data) {
                        var userInfo_ = data.data.userInfo;
                        var app = getApp();
                        app.globalData.userInfo = userInfo_;
                        // //4.解密成功后 获取自己服务器返回的结果
                        if (data.data.result == 1) {
                          wx.redirectTo({
                            url: '/pages/patient/patient',
                          })
                        } else if (data.data.result == 2){
                          _this.setData(
                            { popErrorMsg: "请联系后台人员维护您的基本信息！" }
                          );
                          _this.ohShitfadeOut();
                        } else if (data.data.result == 3) {
                          _this.setData(
                            { popErrorMsg: "权限已被禁用！" }
                          );
                          _this.ohShitfadeOut();
                        }else {
                          _this.setData(
                            { popErrorMsg: "授权登录失败！" }
                          );
                          _this.ohShitfadeOut();
                        }
                      }
                    })
                  }
                })
              } else {
                _this.setData(
                  { popErrorMsg: "登录失败！" }
                );
                _this.ohShitfadeOut();
              }
            }
          })
        }

      }
    })
  },
  ohShitfadeOut() {
    var fadeOutTimeout = setTimeout(() => {
      this.setData({ popErrorMsg: '' });
      clearTimeout(fadeOutTimeout);
    }, 3000);
  }
})
